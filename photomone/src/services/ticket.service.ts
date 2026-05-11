import { API_URLS } from "@constants";
import { api } from "@utils";
import type { TicketPackagesResponse } from "@types";

export const getMyTickets = async (
  marketNumber?: number
): Promise<TicketPackagesResponse> => {
  const params =
    marketNumber != null ? { marketNumber } : undefined;
  const response = await api.get(API_URLS.myTickets, { params });
  return response.data;
};

