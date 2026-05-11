/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URLS, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "@constants";
import { api } from "@utils";

export const signup = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const payload = { fullName, email, password };
  
  try {
    const response = await api.post(API_URLS.signup, payload);
    return response.data;
  } catch (error: any) {
    // Extract error message from API response
    const errorMessage = error.response?.data?.message || error.message || "Signup failed";
    throw new Error(errorMessage);
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await api.post(API_URLS.login, { email, password });
  return response.data;
};

// Google OAuth - Redirect to Google
export const redirectToGoogle = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "email profile openid",
    access_type: "offline",
    prompt: "consent",
  });
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  window.location.href = googleAuthUrl;
};

// Google OAuth - Exchange code for token
export const googleAuthWithCode = async (code: string) => {
  try {
    const response = await api.post(`${API_URLS.googleAuth}?code=${encodeURIComponent(code)}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Google authentication failed";
    throw new Error(errorMessage);
  }
};

// Google OAuth - Login with ID Token (alternative method)
export const googleLoginWithToken = async (token: string) => {
  try {
    const response = await api.post(API_URLS.googleLogin, { token });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Google login failed";
    throw new Error(errorMessage);
  }
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get(API_URLS.me);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post(API_URLS.logout);
  return response.data;
};

// Logout from other devices (revoke other sessions) - used when "already logged in on another device"
export const logoutOtherDevices = async ({ email}: { email: string; }) => {
  const response = await api.post(API_URLS.logoutOtherDevices, { email });
  return response.data;
};

export const forgotPassword = async ({ email }: { email: string }) => {
  try {
    const response = await api.post(API_URLS.forgotPassword, { email });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to send reset email";
    throw new Error(errorMessage);
  }
};

export const resetPassword = async ({
  email,
  forgotPasswordCode,
  newPassword,
}: {
  email: string;
  forgotPasswordCode: number;
  newPassword: string;
}) => {
  try {
    const response = await api.post(API_URLS.resetPassword, {
      email,
      forgotPasswordCode,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Password reset failed";
    throw new Error(errorMessage);
  }
};

export const resendVerificationEmail = async ({ email }: { email: string }) => {
  try {
    const response = await api.post(API_URLS.resendVerificationEmail, { email });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to resend verification code";
    throw new Error(errorMessage);
  }
};

export const verifyPasswordResetToken = async (
  token: string,
  email: string
) => {
  try {
    // TODO: Implement actual token verification
    console.log('Verifying token:', { token, email });
    
    return {
      success: true,
      message: 'Token verified',
      adminId: '1',
    };
  } catch (error: any) {
    console.error(`Auth Service [verifyPasswordResetToken] Error: ${error}`);
    throw new Error('Failed to verify reset token');
  }
};

export const addAdmin = async ({ email }: { email: string }) => {
  try {
    // TODO: Implement actual admin creation
    console.log('Adding admin:', email);
    
    return { id: '1', email, name: 'Admin' };
  } catch (error) {
    console.error(`Auth Service [addUser] Error: ${error}`);
    throw new Error("Couldn't add user");
  }
};
