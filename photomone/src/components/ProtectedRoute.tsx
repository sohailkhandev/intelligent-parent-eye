import { useEffect, useState } from "react";
import { Navigate, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@providers";
import { ROUTES, API_URLS } from "@constants";
import { api } from "@utils";
import { Loading } from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading, authUser, setAuthData, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const [isRedirectingInactive, setIsRedirectingInactive] = useState(false);

  useEffect(() => {
    const processToken = async () => {
      // Check for token in URL (from Google OAuth redirect)
      const tokenFromUrl = searchParams.get("token");

      if (tokenFromUrl) {
        // Decode the token from URL
        let token = decodeURIComponent(tokenFromUrl);
        
        // Ensure proper "Bearer " format (with space after Bearer)
        if (token.startsWith("Bearer") && !token.startsWith("Bearer ")) {
          token = token.replace("Bearer", "Bearer ");
        }
        
        // If token doesn't start with Bearer, add it
        if (!token.startsWith("Bearer ")) {
          token = `Bearer ${token}`;
        }

        try {
          // Fetch user details from /me API - pass token directly in header
          const response = await api.get(API_URLS.me, {
            headers: {
              Authorization: token,
            },
          });
          
          if (response.data?.status === "success" && response.data?.data) {
            // Save auth data with user from /me response
            setAuthData(response.data.data, token);
            
            // Clean the URL - remove token params and fix path
            const cleanPath = location.pathname.replace("/dashboard/dashboard", "/dashboard");
            navigate(cleanPath, { replace: true });
          } else {
            // Invalid response, redirect to login
            navigate(ROUTES.login, { replace: true });
          }
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          // Failed to get user, redirect to login
          navigate(ROUTES.login, { replace: true });
        }
      }
      
      setIsProcessingToken(false);
    };

    processToken();
  }, [searchParams, setAuthData, navigate, location.pathname]);

  // When user is loaded and not active, log out and redirect to login
  useEffect(() => {
    if (isLoading || isProcessingToken || isRedirectingInactive) return;
    if (isLoggedIn && authUser && authUser.isActive === false) {
      setIsRedirectingInactive(true);
      logout()
        .then(() => {
          navigate(ROUTES.login, { state: { from: location, inactive: true }, replace: true });
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate(ROUTES.login, { state: { from: location, inactive: true }, replace: true });
        })
        .finally(() => {
          setIsRedirectingInactive(false);
        });
    }
  }, [isLoggedIn, authUser, isLoading, isProcessingToken, isRedirectingInactive, logout, navigate, location]);

  // Show loading while checking auth state or processing token
  if (isLoading || isProcessingToken || isRedirectingInactive) {
    return <Loading fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  // Don't render dashboard if user is inactive (redirect in progress)
  if (authUser && authUser.isActive === false) {
    return <Loading fullScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
