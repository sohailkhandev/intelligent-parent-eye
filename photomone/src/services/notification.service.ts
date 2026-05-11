import { API_URLS } from "@constants";
import { api } from "@utils";
import type { NotificationsResponse, ApiResponse } from "@types";

export const getNotifications = async (): Promise<NotificationsResponse> => {
  const response = await api.get(API_URLS.notifications);
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse<void>> => {
  const response = await api.put(API_URLS.markNotificationRead(notificationId));
  return response.data;
};

