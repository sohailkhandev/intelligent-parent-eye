import { useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainButton, Loading } from "@components";
import { FormInput } from "./FormInput";
import { COLORS, ROUTES } from "@constants";
import { AuthValidations } from "@validations";
import { AuthApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const resetPasswordMutation = AuthApis.useResetPassword();
  const resendMutation = AuthApis.useResendVerificationEmail();

  const t = translations || {};
  const auth = t.auth || {};
  const resetPassword = auth.resetPassword || {};
  const validation = auth.validation || {};

  const resetPasswordSchema =
    AuthValidations.createFormResetPasswordSchema(validation);

  const rawEmail = searchParams.get("email") || "";
  const email = rawEmail ? decodeURIComponent(rawEmail) : "";

  const handleResendCode = () => {
    if (email && !resendMutation.isPending) {
      resendMutation.mutate({ email });
    }
  };

  const maskedEmail = useMemo(() => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;
    const visibleStart = localPart.charAt(0);
    const visibleEnd =
      localPart.length > 2 ? localPart.charAt(localPart.length - 1) : "";
    return `${visibleStart}${"*".repeat(Math.max(localPart.length - 2, 1))}${visibleEnd}@${domain}`;
  }, [email]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthValidations.FormResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      showToast(
        resetPassword.passwordResetSuccessful || "Password reset successful!",
        "success"
      );
      navigate(ROUTES.login, { replace: true });
    }
  }, [resetPasswordMutation.isSuccess, navigate, showToast, resetPassword]);

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.forgotPassword, { replace: true });
    }
  }, [email, navigate]);

  const onSubmit = (data: AuthValidations.FormResetPasswordType) => {
    resetPasswordMutation.mutate({
      email,
      forgotPasswordCode: parseInt(data.otp, 10),
      newPassword: data.newPassword,
    });
  };

  if (!email) {
    return null;
  }

  return (
    <>
      <Typography
        className="!text-sm lg:!text-base text-center mb-2"
        sx={{ color: COLORS.grayDark }}
      >
        {resetPassword.otpSent || "OTP has been sent to your email"}
      </Typography>
      <Typography
        className="!text-base !font-medium text-center mb-6"
        sx={{ color: COLORS.generalText }}
      >
        {maskedEmail}
      </Typography>

      <Box
        component="form"
        className="flex flex-col gap-5 mt-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {resendMutation.isSuccess && (
          <Box
            className="p-3 rounded-lg"
            sx={{
              backgroundColor: `${COLORS.primary}15`,
              border: `1px solid ${COLORS.primary}40`,
            }}
          >
            <Typography
              className="!text-sm !text-center"
              sx={{ color: COLORS.primary }}
            >
              {resetPassword.codeResent ||
                "Verification code resent successfully!"}
            </Typography>
          </Box>
        )}

        {(resetPasswordMutation.isError || resendMutation.isError) && (
          <Box
            className="p-3 rounded-lg"
            sx={{
              backgroundColor: `${COLORS.secondary}15`,
              border: `1px solid ${COLORS.secondary}40`,
            }}
          >
            <Typography
              className="!text-sm !text-center"
              sx={{ color: COLORS.secondary }}
            >
              {resetPasswordMutation.error?.message ||
                resendMutation.error?.message ||
                resetPassword.anErrorOccurred ||
                "An error occurred"}
            </Typography>
          </Box>
        )}

        <Box>
          <label
            htmlFor="otp"
            className="block text-sm lg:text-base font-bold mb-2"
            style={{ color: COLORS.generalText }}
          >
            {resetPassword.otpCode ? `${resetPassword.otpCode}*` : "OTP Code*"}
          </label>
          <Box className="flex justify-center">
            <input
              id="otp"
              type="text"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              placeholder="------"
              {...register("otp")}
              className="w-[180px] px-4 py-3 text-center text-lg font-mono tracking-[0.5em] rounded-none border-0 border-b-2 bg-transparent focus:outline-none transition-colors"
              style={{
                color: COLORS.generalText,
                borderBottomColor: errors.otp ? "#ef4444" : COLORS.grayLight,
              }}
              onFocus={(e) => {
                if (!errors.otp)
                  e.currentTarget.style.borderBottomColor = COLORS.secondary;
              }}
              onBlur={(e) => {
                if (!errors.otp)
                  e.currentTarget.style.borderBottomColor = COLORS.grayLight;
              }}
            />
          </Box>
          {errors.otp?.message && (
            <Typography
              className="!text-sm !text-center mt-1"
              sx={{ color: "#ef4444" }}
            >
              {errors.otp.message}
            </Typography>
          )}
          <Box className="text-center mt-3">
            <Box
              component="button"
              type="button"
              onClick={handleResendCode}
              disabled={resendMutation.isPending}
              className="!text-sm border-0 bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              sx={{ color: COLORS.secondary }}
            >
              {resendMutation.isPending
                ? resetPassword.resending || "Resending..."
                : resetPassword.resendVerificationCode ||
                  "Resend verification code"}
            </Box>
          </Box>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            label={
              resetPassword.newPassword
                ? `${resetPassword.newPassword}*`
                : "New Password*"
            }
            placeholder={resetPassword.enterNewPassword || "Enter new password"}
            register={register("newPassword")}
            error={errors.newPassword?.message}
            variant="underline"
          />
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            label={
              resetPassword.confirmPassword
                ? `${resetPassword.confirmPassword}*`
                : "Confirm Password*"
            }
            placeholder={
              resetPassword.confirmNewPassword || "Confirm new password"
            }
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            variant="underline"
          />
        </Box>

        <MainButton
          type="submit"
          className="w-full !mt-2"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? (
            <Box className="flex items-center justify-center gap-2">
              <Loading size={16} />
              <span>{resetPassword.resetting || "Resetting..."}</span>
            </Box>
          ) : (
            resetPassword.resetPasswordButton || "Reset Password"
          )}
        </MainButton>

        <Box className="text-center mt-4">
          <Link
            to={ROUTES.login}
            className="!font-medium !text-sm hover:opacity-90"
            style={{ color: COLORS.secondary, textDecoration: "none" }}
          >
            {resetPassword.backToLogin || "Back to Login"}
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default ResetPasswordForm;
