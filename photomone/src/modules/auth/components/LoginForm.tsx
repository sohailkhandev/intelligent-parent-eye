import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainButton } from "@components";
import { FormInput } from "./FormInput";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { COLORS, ROUTES } from "@constants";
import { AuthValidations } from "@validations";
import { AuthApis } from "@apis";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { ThemeText } from "@components";

const ALREADY_LOGGED_IN_OTHER_DEVICE = "already logged in on another device";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = AuthApis.useLogin();
  const logoutOtherMutation = AuthApis.useLogoutOtherDevices();
  const { setAuthData } = useAuthContext();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const [otherDeviceError, setOtherDeviceError] = useState(false);
  const emailAtErrorRef = useRef<string | null>(null);

  const t = translations || {};
  const auth = t.auth || {};
  const login = auth.login || {};
  const loginErrors = login.errors || {};
  const validation = auth.validation || {};

  const loginSchema = AuthValidations.createFormLoginSchema(validation);

  // Show inactive account message when redirected from dashboard
  useEffect(() => {
    const state = location.state as {
      inactive?: boolean;
      from?: unknown;
    } | null;
    if (state?.inactive) {
      showToast(
        login.accountInactive ||
          "Your account is inactive. Please contact admin to activate your account.",
        "error"
      );
      navigate(ROUTES.login, {
        replace: true,
        state: state.from ? { from: state.from } : undefined,
      });
    }
  }, [location.state, login.accountInactive, showToast, navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthValidations.FormLoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Helper function to normalize backend error messages
  const normalizeErrorMessage = (errorMessage: string): string => {
    if (!errorMessage) return errorMessage;

    const errorLower = errorMessage.toLowerCase();
    const loginErrors = login.errors || {};

    // Check for common login error patterns
    if (
      errorLower.includes("invalid password") ||
      errorLower.includes("password is invalid")
    ) {
      return (
        loginErrors.invalidPassword || "Invalid password. Please try again."
      );
    }

    if (
      errorLower.includes("invalid email") ||
      errorLower.includes("email is invalid")
    ) {
      return loginErrors.invalidEmail || "Invalid email address.";
    }

    if (
      errorLower.includes("user not found") ||
      errorLower.includes("user doesn't exist") ||
      errorLower.includes("user with this email does not exist")
    ) {
      return (
        loginErrors.userNotFound ||
        "User not found. Please check your email address."
      );
    }

    if (
      errorLower.includes("not verified") ||
      errorLower.includes("email not verified") ||
      errorLower.includes("account not verified")
    ) {
      return (
        loginErrors.accountNotVerified ||
        "Please verify your email address before logging in."
      );
    }

    if (
      errorLower.includes("account locked") ||
      errorLower.includes("account is locked")
    ) {
      return (
        loginErrors.accountLocked ||
        "Your account has been locked. Please contact support."
      );
    }

    if (
      errorLower.includes("account is inactive") ||
      errorLower.includes("inactive account")
    ) {
      return (
        login.accountInactive ||
        "Your account is inactive. Please contact admin to activate your account."
      );
    }

    // Return original message if no match found
    return errorMessage;
  };

  const onSubmit = async (values: AuthValidations.FormLoginType) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  const handleLogoutOtherDevices = () => {
    const email = emailAtErrorRef.current?.trim();
    if (!email) {
      showToast(
        login.loginFailed || "Please try logging in again to use this option.",
        "error"
      );
      return;
    }
    logoutOtherMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setOtherDeviceError(false);
          emailAtErrorRef.current = null;
          showToast(
            login.logoutOtherDevicesSuccess ||
              "Logged out from other devices. You can try logging in again.",
            "success"
          );
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            login.loginFailed;
          showToast(msg, "error");
        },
      }
    );
  };

  useEffect(() => {
    if (loginMutation.isSuccess) {
      const { data } = loginMutation.data;
      if (data?.token && data?.user) {
        setAuthData(data.user, data.token);
        navigate(ROUTES.dashboard);
      }
    }
    if (loginMutation.isError) {
      const error = loginMutation.error as any;
      const backendMessage =
        error?.response?.data?.message || error?.message || "";
      const isOtherDeviceError = backendMessage
        .toLowerCase()
        .includes(ALREADY_LOGGED_IN_OTHER_DEVICE);
      if (isOtherDeviceError) {
        emailAtErrorRef.current =
          (loginMutation.variables as { email?: string })?.email ?? null;
      }
      setOtherDeviceError(isOtherDeviceError);

      if (!isOtherDeviceError) {
        const normalizedMessage = normalizeErrorMessage(backendMessage);
        const message =
          normalizedMessage ||
          login.loginFailed ||
          "Login failed. Please try again.";
        showToast(message, "error");
      }
    } else {
      setOtherDeviceError(false);
      emailAtErrorRef.current = null;
    }
  }, [
    loginMutation.isSuccess,
    loginMutation.isError,
    loginMutation.data,
    loginMutation.error,
    setAuthData,
    navigate,
    showToast,
    login,
  ]);

  return (
    <>
      <Box className="text-center my-6 flex items-center justify-center gap-2">
        <ThemeText text={login.dontHaveAccount || "Don't have an account?"} />
        <Link
          to={ROUTES.register}
          className="!font-medium hover:opacity-90"
          style={{ color: COLORS.secondary, textDecoration: "none" }}
        >
          {login.signUp || "Sign up"}
        </Link>
      </Box>

      <Box
        component="form"
        className="flex flex-col gap-5 mt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label={login.emailAddress ? `${login.emailAddress}*` : "Email*"}
          placeholder={login.emailPlaceholder || "Enter the e-mail"}
          register={register("email")}
          error={errors.email?.message}
          variant="underline"
        />

        <Box>
          <FormInput
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            label={login.password ? `${login.password}*` : "Password*"}
            placeholder={login.passwordPlaceholder || "Enter the password"}
            register={register("password")}
            error={errors.password?.message}
            variant="underline"
          />
          <Box className="flex justify-end mt-2">
            <Link
              to={ROUTES.forgotPassword}
              className="!font-medium !text-sm"
              style={{ color: COLORS.secondary, textDecoration: "none" }}
            >
              {login.forgotPassword || "Forgot Password?"}
            </Link>
          </Box>
          {otherDeviceError && (
            <Box className="text-sm text-red-500 mt-3 text-center">
              {loginErrors.alreadyLoggedInOtherDevice ||
                "You are already logged in on another device."}{" "}
              <Box
                component="button"
                type="button"
                onClick={handleLogoutOtherDevices}
                disabled={logoutOtherMutation.isPending}
                className="font-medium cursor-pointer bg-transparent border-0 p-0"
                sx={{ color: COLORS.secondary }}
              >
                {loginErrors.clickHereToLogoutOtherDevices || "click here"}
              </Box>{" "}
              {loginErrors.toLogoutOtherDevices ||
                "to logout of other devices."}
            </Box>
          )}
        </Box>

        <MainButton
          type="submit"
          className="w-full !mt-2"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending
            ? login.loggingIn || "Logging in..."
            : login.loginButton || "Login"}
        </MainButton>

        <Box className="flex items-center gap-3 mt-4">
          <Box className="flex-1 h-px" sx={{ backgroundColor: "#D4D4D8" }} />
          <ThemeText
            text={
              login.orSignInWith || login.orContinueWith || "Or sign in with"
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

export default LoginForm;
