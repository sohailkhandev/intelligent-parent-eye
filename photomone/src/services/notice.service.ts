import { API_URLS } from "@constants";
import { api } from "@utils";
import type { NoticesResponse } from "@types";

export const getNotices = async (): Promise<NoticesResponse> => {
  const response = await api.get(API_URLS.notices);
  return response.data;
};
