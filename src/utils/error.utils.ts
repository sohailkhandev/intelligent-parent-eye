import { AxiosError } from "axios";

/**
 * Extract user-facing error message from API/axios errors.
 * Prefers backend response body message, then Error.message, then fallback.
 */
export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  const axiosError = error as AxiosError<{ message?: string; error?: string; data?: { message?: string } }>;
  const data = axiosError.response?.data;
  if (data) {
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;
    if (data.data && typeof data.data.message === "string") return data.data.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
