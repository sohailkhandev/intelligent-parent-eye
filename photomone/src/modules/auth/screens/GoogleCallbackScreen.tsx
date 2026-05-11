import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext, useAppContext } from "@providers";
import { ROUTES, API_URLS } from "@constants";
import { api } from "@utils";
import { Loading } from "@components";

export const GoogleCallbackScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuthContext();
  const { showToast } = useAppContext();
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Prevent double execution
      if (isProcessing.current) return;

      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        showToast("Google login was cancelled or failed", "error");
        navigate(ROUTES.login);
        return;
      }

      if (!code) {
        showToast("No authorization code received", "error");
        navigate(ROUTES.login);
        return;
      }

      isProcessing.current = true;

      try {
        // Send code to backend
        const response = await api.post(
          `${API_URLS.googleAuth}?code=${encodeURIComponent(code)}`
        );
        const result = response.data;

        if (
          result.status === "success" &&
          result.data?.token &&
          result.data?.user
        ) {
          // Save auth data
          setAuthData(result.data.user, result.data.token);
          showToast("Login successful!", "success");
          // Redirect to dashboard
          navigate(ROUTES.dashboard, { replace: true });
        } else {
          showToast("Invalid response from server", "error");
          navigate(ROUTES.login);
        }
      } catch (err: unknown) {
        console.error("Google auth error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Google login failed";
        showToast(errorMessage, "error");
        navigate(ROUTES.login);
      }
    };

    handleGoogleCallback();
  }, [searchParams, setAuthData, showToast, navigate]);

  return (
    <Box className="flex flex-col min-h-[calc(100vh-128px)] items-center justify-center px-4">
      <Box className="text-center">
        <Box className="mb-3">
          <Loading size={48} />
        </Box>
        <Typography className="!text-white !text-lg font-proxima">
          Processing Google login...
        </Typography>
        <Typography className="!text-gray-400 !text-sm font-proxima mt-2">
          Please wait while we verify your account
        </Typography>
      </Box>
    </Box>
  );
};

export default GoogleCallbackScreen;
