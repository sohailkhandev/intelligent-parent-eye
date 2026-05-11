import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainButton, Loading, ThemeText } from "@components";
import { FormInput } from "./FormInput";
import { COLORS, ROUTES } from "@constants";
import { AuthValidations } from "@validations";
import { AuthApis } from "@apis";
import { useLanguage } from "@providers";

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = AuthApis.useForgotPassword();
  const submittedEmailRef = useRef<string>("");
  const { translations } = useLanguage();
  const t = translations || {};
  const auth = t.auth || {};
  const forgotPassword = auth.forgotPassword || {};
  const validation = auth.validation || {};

  const forgotPasswordSchema =
    AuthValidations.createFormForgotPasswordSchema(validation);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthValidations.FormForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (forgotPasswordMutation.isSuccess && submittedEmailRef.current) {
      navigate(
        `${ROUTES.resetPassword}?email=${encodeURIComponent(submittedEmailRef.current)}`
      );
    }
  }, [forgotPasswordMutation.isSuccess, navigate]);

  const onSubmit = (data: AuthValidations.FormForgotPasswordType) => {
    submittedEmailRef.current = data.email;
    forgotPasswordMutation.mutate({ email: data.email });
  };

  return (
    <>
      <ThemeText
        text={
          forgotPassword.description ||
          "Enter your email address and we'll send you instructions to reset your password."
        }
        className="text-center mt-4 lg:mt-6 mb-6"
      />

      <Box
        component="form"
        className="flex flex-col gap-5 mt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {forgotPasswordMutation.isError && (
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
              {forgotPasswordMutation.error?.message ||
                forgotPassword.failedToSend ||
                "Failed to send reset email"}
            </Typography>
          </Box>
        )}

        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label={
            forgotPassword.emailAddress
              ? `${forgotPassword.emailAddress}*`
              : "Email*"
          }
          placeholder={forgotPassword.enterEmailAddress || "Enter the e-mail"}
          register={register("email")}
          error={errors.email?.message}
          variant="underline"
        />

        <MainButton
          type="submit"
          className="w-full !mt-2"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? (
            <Box className="flex items-center justify-center gap-2">
              <Loading size={16} />
              <span>{forgotPassword.sending || "Sending..."}</span>
            </Box>
          ) : (
            forgotPassword.sendResetOTP || "Send Reset OTP"
          )}
        </MainButton>

        <Box className="text-center mt-4">
          <Link
            to={ROUTES.login}
            className="!font-medium !text-sm hover:opacity-90"
            style={{ color: COLORS.secondary, textDecoration: "none" }}
          >
            {forgotPassword.backToLogin || "Back to Login"}
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPasswordForm;
