import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@services";

export const useSignup = () =>
  useMutation({
    mutationFn: AuthService.signup,
  });

export const useLogin = () =>
  useMutation({
    mutationFn: AuthService.login,
  });

export const useGoogleAuthWithCode = () =>
  useMutation({
    mutationFn: AuthService.googleAuthWithCode,
  });

export const useGoogleLoginWithToken = () =>
  useMutation({
    mutationFn: AuthService.googleLoginWithToken,
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: AuthService.forgotPassword,
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: AuthService.resetPassword,
  });

export const useResendVerificationEmail = () =>
  useMutation({
    mutationFn: AuthService.resendVerificationEmail,
  });

export const useLogout = () =>
  useMutation({
    mutationFn: AuthService.logout,
  });

export const useLogoutOtherDevices = () =>
  useMutation({
    mutationFn: AuthService.logoutOtherDevices,
  });