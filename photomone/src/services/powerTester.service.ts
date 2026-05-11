import { API_URLS } from "@constants";
import { api } from "@utils";

export interface PowerTesterApplicationParams {
  email: string;
  socialMediaUrl: string;
}

export interface PowerTesterApplicationResponse {
  status?: string;
  message?: string;
}

export const submitPowerTesterApplication = async (
  params: PowerTesterApplicationParams
): Promise<PowerTesterApplicationResponse> => {
  try {
    const response = await api.post<PowerTesterApplicationResponse>(
      API_URLS.powerTesters,
      {
        email: params.email.trim(),
        socialMediaUrl: params.socialMediaUrl.trim(),
      }
    );
    return response.data ?? {};
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const msg =
      err.response?.data?.message ??
      (error instanceof Error ? error.message : null) ??
      "Failed to submit application";
    throw new Error(msg);
  }
};
