import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainButton, ThemeText } from "@components";
import { FormInput } from "./FormInput";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { COLORS, ROUTES } from "@constants";
import { AuthValidations } from "@validations";
import { AuthApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";

export const RegisterForm = () => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const signupMutation = AuthApis.useSignup();

  const t = translations || {};
  const auth = t.auth || {};
  const registerT = auth.register || {};
  const validation = auth.validation || {};

  const registerSchema = AuthValidations.createFormRegisterSchema(validation);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<AuthValidations.FormRegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: AuthValidations.FormRegisterType) => {
    try {
      signupMutation.mutate({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  useEffect(() => {
    if (signupMutation.isSuccess) {
      showToast(
        registerT.verificationSent ||
          "Verification link has been sent to your email",
        "success"
      );
      reset();
    }
    if (signupMutation.isError) {
      const error = signupMutation.error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        error?.response?.data?.message ||
        error?.message ||
        registerT.registrationFailed ||
        "Registration failed. Please try again.";
      showToast(message, "error");
    }
  }, [
    signupMutation.isSuccess,
    signupMutation.isError,
    signupMutation.error,
    reset,
    showToast,
    registerT,
  ]);

  return (
    <>
      <Box className="text-center mb-6 mt-4 lg:mt-6 lg:mb-6 flex items-center justify-center gap-2">
        <ThemeText text={registerT.haveAccount || "Have an account?"} />
        <Link
          to={ROUTES.login}
          className="!font-medium hover:opacity-90"
          style={{ color: COLORS.secondary, textDecoration: "none" }}
        >
          {registerT.login || "Login"}
        </Link>
      </Box>

      <Box
        component="form"
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          label={registerT.fullName ? `${registerT.fullName}` : "Full Name"}
          placeholder={registerT.namePlaceholder || "Enter the name"}
          register={register("fullName")}
          error={errors.fullName?.message}
          variant="underline"
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label={registerT.emailAddress ? `${registerT.emailAddress}` : "Email"}
          placeholder={registerT.emailPlaceholder || "Enter the e-mail"}
          register={register("email")}
          error={errors.email?.message}
          variant="underline"
        />

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            label={registerT.password ? `${registerT.password}` : "Password"}
            placeholder={registerT.passwordPlaceholder || "Enter the password"}
            register={register("password")}
            error={errors.password?.message}
            variant="underline"
          />
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            label={
              registerT.confirmPassword
                ? `${registerT.confirmPassword}`
                : "Confirm Password"
            }
            placeholder={
              registerT.confirmPasswordPlaceholder || "Reenter the password"
            }
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            variant="underline"
          />
        </Box>

        <Box className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            style={{
              accentColor: COLORS.secondary,
            }}
            {...register("terms")}
          />
          <label
            htmlFor="terms"
            className="!text-sm flex-1 cursor-pointer"
            style={{ color: COLORS.generalText }}
          >
            {registerT.agreeTerms || "I agree to the"}{" "}
            <Link
              to={ROUTES.termsAndConditions}
              className="!font-medium hover:opacity-90"
              style={{ color: COLORS.secondary, textDecoration: "none" }}
            >
              {registerT.termsOfService || "Terms of Service"}
            </Link>{" "}
            {registerT.and || "and"}{" "}
            <Link
              to={ROUTES.privacyPolicy}
              className="!font-medium hover:opacity-90"
              style={{ color: COLORS.secondary, textDecoration: "none" }}
            >
              {registerT.privacyPolicy || "Privacy Policy"}
            </Link>
          </label>
        </Box>
        {errors.terms && (
          <Typography className="!text-red-500 !text-xs -mt-2">
            {errors.terms.message}
          </Typography>
        )}

        <MainButton
          type="submit"
          className="w-full !mt-2"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending
            ? registerT.creatingAccount || "Creating Account..."
            : registerT.signUpButton || "Sign Up"}
        </MainButton>

        <Box className="flex items-center gap-3 mt-6">
          <Box className="flex-1 h-px" sx={{ backgroundColor: "#D4D4D8" }} />
          <ThemeText
            text={
              registerT.orSignInWith ||
              registerT.orContinueWith ||
              "Or sign in with"
            }
          />
          <Box className="flex-1 h-px" sx={{ backgroundColor: "#D4D4D8" }} />
        </Box>

        <Box className="mt-2">
          <GoogleSignInButton variant="light" />
        </Box>
      </Box>
    </>
  );
};

export default RegisterForm;
