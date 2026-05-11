/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URLS } from "@constants";
import { api } from "@utils";

export interface ChatbotResponse {
  status: string;
  data: {
    reply: string;
  };
}

export const sendChatbotMessage = async (message: string): Promise<string> => {
  try {
    const response = await api.post<ChatbotResponse>(API_URLS.chatbot, { message });
    if (response.data?.status === "success" && response.data?.data?.reply) {
      return response.data.data.reply;
    }
    throw new Error("Invalid chatbot response");
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to get response";
    throw new Error(errorMessage);
  }
};
