import React, { createContext, useContext, useState, useEffect } from "react";
import { IParent } from "@types";
import { AuthService } from "@services";

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

  const setAuthUser = (user: IParent | null) => setAuthUserState(user);
  const setIsLoggedIn = (value: boolean) => setIsLoggedInState(value);

  const refreshAuthUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
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
      setAuthUserState(null);
      setIsLoggedInState(false);
    }
  };

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
      })
      .catch(() => {
        AuthService.clearAuthStorage();
        setAuthUserState(null);
        setIsLoggedInState(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const logout = () => {
    setAuthUserState(null);
    setIsLoggedInState(false);
    setAuthError("");
    AuthService.logout(); // POST /admin/logout then clear storage (fire-and-forget)
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoading,
        isLoggedIn,
        authError,
        logout,
        refreshAuthUser,
        setAuthUser,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
