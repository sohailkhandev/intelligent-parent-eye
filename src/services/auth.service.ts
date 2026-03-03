import { ApiUtils, getErrorMessage } from "@utils";
import {
  API_URLS,
  PARENT_LOGIN_URL,
  PARENT_ME_URL,
  PARENT_SIGNUP_URL,
} from "@constants";
import { IAdmin, IChild, IParent } from "@types";

const AUTH_TOKEN_KEY = "token";
const AUTH_USER_KEY = "authUser";

/** Parent login: POST to the-parent-eye.onrender.com with email, password */
export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await ApiUtils.api.post<{
      status?: string;
      data?: { token: string; user: Record<string, unknown> };
    }>(PARENT_LOGIN_URL, { email, password });

    const payload = response.data;
    const data = payload?.data;
    const token = data?.token;
    const user = data?.user;

    if (!token || !user) {
      throw new Error("Invalid login response. Please try again.");
    }

    const admin = user as IAdmin;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(admin));

    return { user: admin, token };
  } catch (err) {
    const message = getErrorMessage(err, "Login failed. Please try again.");
    throw new Error(message);
  }
};

/** Parent signup: POST to the-parent-eye.onrender.com with fullName, email, password */
export const register = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await ApiUtils.api.post<{
      data?: { token?: string; user?: Record<string, unknown>; message?: string };
      message?: string;
      status?: string;
    }>(PARENT_SIGNUP_URL, { fullName, email, password });

    const payload = response.data;
    const data = payload?.data;
    const token = data?.token;
    const user = data?.user;
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : typeof data?.message === "string"
          ? data.message
          : undefined;

    if (token && user) {
      const admin = user as IAdmin;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(admin));
      return { user: admin, token, message };
    }

    return { user: undefined, token: undefined, message };
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Sign up failed. Please try again."
    );
    throw new Error(message);
  }
};

export const getStoredAuthUser = (): IAdmin | IParent | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as IAdmin | IParent) : null;
  } catch {
    return null;
  }
};

/** Parent /me: GET with Bearer token, returns parent + children */
export const getMe = async (): Promise<{
  parent: IParent;
  children: IChild[];
}> => {
  try {
    const response = await ApiUtils.api.get<{
      status: string;
      data: { parent: IParent; children: IChild[] };
    }>(PARENT_ME_URL);
    const data = response.data?.data;
    const parent = data?.parent;
    const children = data?.children ?? [];
    if (!parent) {
      throw new Error("Invalid response from server.");
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(parent));
    return { parent, children };
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Failed to load user. Please log in again."
    );
    throw new Error(message);
  }
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const setStoredAuthUser = (user: IAdmin | IParent): void => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const logout = async (): Promise<void> => {
  try {
    await ApiUtils.api.post(API_URLS.logout);
  } catch {
    // Ignore (parent API may not have logout; clear local state)
  } finally {
    clearAuthStorage();
  }
};

export const sendForgotPassword = async (email: string) => {
  try {
    const response = await ApiUtils.api.post(API_URLS.forgotPassword, { email });
    return response.data;
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Failed to send reset email. Please try again."
    );
    throw new Error(message);
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
    const response = await ApiUtils.api.post(API_URLS.resetPassword, {
      email,
      forgotPasswordCode,
      newPassword,
    });
    return response.data;
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Failed to reset password. Please try again."
    );
    throw new Error(message);
  }
};
