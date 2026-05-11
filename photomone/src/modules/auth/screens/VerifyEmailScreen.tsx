import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormContainer, Loading } from "@components";
import { COLORS, ROUTES } from "@constants";
import { useLanguage } from "@providers";
import authBg from "@assets/images/authBg.jpg";

type VerificationState = "verifying" | "success" | "error";

export const VerifyEmailScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerificationState>("verifying");
  const { translations } = useLanguage();

  const t = translations || {};
  const auth = t.auth || {};
  const verifyEmail = auth.verifyEmail || {};

  const isSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    if (!isSuccess) {
      setState("error");
      return;
    }

    const verifyingTimer = setTimeout(() => {
      setState("success");
    }, 3000);

    return () => clearTimeout(verifyingTimer);
  }, [isSuccess]);

  useEffect(() => {
    if (state === "success") {
      const redirectTimer = setTimeout(() => {
        navigate(ROUTES.login, { replace: true });
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [state, navigate]);

  return (
    <Box
      className="flex flex-col items-center justify-center px-4 py-30 min-h-[calc(100vh-128px)]"
      sx={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "100% 100%",
      }}
    >
      <FormContainer
        title={verifyEmail.title || "Verify Email"}
        onClose={() => navigate(-1)}
        className="max-w-[500px]"
      >
        <Box className="text-center py-6 mt-6">
          {state === "verifying" && (
            <>
              <Box className="mb-6">
                <Loading size={56} />
              </Box>
              <Typography
                className="!text-xl !font-semibold mb-2"
                sx={{ color: COLORS.generalText }}
              >
                {verifyEmail.verifyingTitle || "Verifying your email"}
              </Typography>
              <Typography className="!text-sm" sx={{ color: COLORS.grayDark }}>
                {verifyEmail.verifyingDescription ||
                  "Please wait while we verify your email address..."}
              </Typography>
            </>
          )}

          {state === "success" && (
            <>
              <Box className="mb-6">
                <Box
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  sx={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke={COLORS.primary}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </Box>
              </Box>
              <Typography
                className="!text-xl !font-semibold mb-2"
                sx={{ color: COLORS.generalText }}
              >
                {verifyEmail.successTitle || "Email Verified!"}
              </Typography>
              <Typography className="!text-sm" sx={{ color: COLORS.grayDark }}>
                {verifyEmail.successDescription || "Redirecting to login..."}
              </Typography>
            </>
          )}

          {state === "error" && (
            <>
              <Box className="mb-6">
                <Box
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  sx={{ backgroundColor: `${COLORS.secondary}20` }}
                >
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke={COLORS.secondary}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Box>
              </Box>
              <Typography
                className="!text-xl !font-semibold mb-2"
                sx={{ color: COLORS.generalText }}
              >
                {verifyEmail.errorTitle || "Verification Failed"}
              </Typography>
              <Typography
                className="!text-sm mb-6"
                sx={{ color: COLORS.grayDark }}
              >
                {verifyEmail.errorDescription ||
                  "Something went wrong. Please try again."}
              </Typography>
              <Box
                component="button"
                onClick={() => navigate(ROUTES.login)}
                className="!font-medium !text-sm border-0 bg-transparent cursor-pointer hover:opacity-90"
                sx={{ color: COLORS.secondary }}
              >
                {verifyEmail.goToLogin || "Go to Login"}
              </Box>
            </>
          )}
        </Box>
      </FormContainer>
    </Box>
  );
};

export default VerifyEmailScreen;
