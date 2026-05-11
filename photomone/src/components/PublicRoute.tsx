import { Navigate } from "react-router-dom";
import { useAuthContext } from "@providers";
import { ROUTES } from "@constants";
import { Loading } from "./Loading";

interface PublicRouteProps {
  children: React.ReactNode;
}

// Redirect authenticated users away from auth pages (login/register)
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn, isLoading } = useAuthContext();

  // Show loading while checking auth state
  if (isLoading) {
    return <Loading fullScreen />;
  }

  // Redirect to dashboard if already authenticated
  if (isLoggedIn) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

