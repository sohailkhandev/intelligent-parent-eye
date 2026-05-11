/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { User } from "@types";
import { useAppContext } from "./app.provider";
import { useLanguage } from "./language.provider.simple";
import { AuthService, SocketService } from "@services";
import { SOCKET_BASE_URL } from "@constants";

interface AuthContextType {
  authUser: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  token: string | null;
  setAuthData: (user: User, token: string) => void;
  login: (user: User) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  isLoading: false,
  isLoggedIn: false,
  token: null,
  setAuthData: () => {},
  login: () => {},
  refreshUser: async () => {},
  logout: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user from /auth/me API
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await AuthService.getCurrentUser();
      if (response?.data) {
        const user = response.data;
        // If backend marks session as replaced by another device, immediately clear local state
        // so protected routes don't render with an invalid token (blank screen risk).
        if (user?.isLoggedIn === false) {
          SocketService.disconnectSocket();
          localStorage.removeItem("token");
          setToken(null);
          setAuthUser(null);
          return null;
        }
        // Inactive users must not stay logged in
        if (user.isActive === false) {
          SocketService.disconnectSocket();
          localStorage.removeItem("token");
          setToken(null);
          setAuthUser(null);
          return null;
        }
        setAuthUser(user);
        return user;
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      SocketService.disconnectSocket();
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
    }
    return null;
  }, []);

  // On mount, check for token and fetch user from API
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
        const user = await fetchCurrentUser();
        if (user) {
          SocketService.connectSocket({ apiBaseUrl: SOCKET_BASE_URL, token: storedToken });
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [fetchCurrentUser]);

  // Set auth data (user + token) - only store token in localStorage
  const setAuthData = useCallback((user: User, newToken: string) => {
    setAuthUser(user);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    SocketService.connectSocket({ apiBaseUrl: SOCKET_BASE_URL, token: newToken });
  }, []);

  const login = useCallback((user: User) => {
    setAuthUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      SocketService.disconnectSocket();
      await AuthService.logout();
      setAuthUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout API error:", error);
      SocketService.disconnectSocket();
      setAuthUser(null);
      setToken(null);
      localStorage.removeItem("token");
      // Do not rethrow: multi-device invalidation often makes /auth/logout fail,
      // but we still must clear local state to redirect to login.
    }
  }, []);

  // Refresh user by fetching from /auth/me API
  const refreshUser = useCallback(async () => {
    const user = await fetchCurrentUser();
    if (!user || user?.isLoggedIn === false) {
      // local state already cleared by fetchCurrentUser in the isLoggedIn === false case.
      showToast(
        translations?.auth?.login?.loggedInOnAnotherDevice ??
          "You are logged in on another device.",
        "info"
      );
      try {
        // In case local state wasn't cleared for some reason, ensure cleanup.
        await logout();
      } catch {
        // ignore
      }
    }
  }, [fetchCurrentUser, logout, showToast, translations]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoading,
        isLoggedIn: !!authUser && !!token,
        token,
        setAuthData,
        login,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
