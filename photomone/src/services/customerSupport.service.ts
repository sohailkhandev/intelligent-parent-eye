/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URLS } from "@constants";
import { api } from "@utils";

export interface CustomerSupportParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Single attachment only - backend expects one "attachment" field (binary). */
  attachment?: File | null;
}

export const sendCustomerSupportMessage = async ({ name, email, subject, message, attachment }: CustomerSupportParams) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    const response = await api.post(API_URLS.customerSupport, formData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to send message";
    throw new Error(errorMessage);
  }
};
