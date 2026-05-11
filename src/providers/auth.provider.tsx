import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { IParent } from "@types";
import { AuthService, SocketService } from "@services";
import { SOCKET_BASE_URL } from "@constants";

interface AuthContextType {
  authUser: IParent | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  authError: string;
  logout: () => void;
  refreshAuthUser: () => Promise<void>;
  setAuthUser: (user: IParent | null) => void;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  isLoading: false,
  isLoggedIn: false,
  authError: "",
  logout: () => {},
  refreshAuthUser: async () => {},
  setAuthUser: () => {},
  setIsLoggedIn: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUserState] = useState<IParent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [authError, setAuthError] = useState("");

  const setAuthUser = useCallback((user: IParent | null) => {
    setAuthUserState(user);
  }, []);

  const setIsLoggedIn = useCallback((value: boolean) => {
    setIsLoggedInState(value);
  }, []);

  const refreshAuthUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      SocketService.disconnectSocket();
      setAuthUserState(null);
      setIsLoggedInState(false);
      return;
    }
    try {
      const { parent } = await AuthService.getMe();
      setAuthUserState(parent);
      setIsLoggedInState(true);
      setAuthError("");
    } catch {
      AuthService.clearAuthStorage();
      SocketService.disconnectSocket();
      setAuthUserState(null);
      setIsLoggedInState(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    AuthService.getMe()
      .then(({ parent }) => {
        setAuthUserState(parent);
        setIsLoggedInState(true);
        const token = localStorage.getItem("token");
        if (token) {
          SocketService.connectSocket({
            apiBaseUrl: SOCKET_BASE_URL,
            token,
          });
        }
      })
      .catch(() => {
        AuthService.clearAuthStorage();
        SocketService.disconnectSocket();
        setAuthUserState(null);
        setIsLoggedInState(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!isLoggedIn || !token) {
      SocketService.disconnectSocket();
      return;
    }

    SocketService.connectSocket({
      apiBaseUrl: SOCKET_BASE_URL,
      token,
    });
  }, [isLoggedIn]);

  const logout = useCallback(() => {
    SocketService.disconnectSocket();
    setAuthUserState(null);
    setIsLoggedInState(false);
    setAuthError("");
    AuthService.logout(); // POST /parents/logout then clear storage (fire-and-forget)
  }, []);

  const contextValue = useMemo(
    () => ({
      authUser,
      isLoading,
      isLoggedIn,
      authError,
      logout,
      refreshAuthUser,
      setAuthUser,
      setIsLoggedIn,
    }),
    [
      authUser,
      isLoading,
      isLoggedIn,
      authError,
      logout,
      refreshAuthUser,
      setAuthUser,
      setIsLoggedIn,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
