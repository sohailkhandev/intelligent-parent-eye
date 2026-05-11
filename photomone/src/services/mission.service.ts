/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URLS } from "@constants";
import { api } from "@utils";
import type { MissionsListResponse } from "@types";

export const getMissions = async (): Promise<MissionsListResponse> => {
  try {
    const response = await api.get(API_URLS.missions);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch missions";
    throw new Error(errorMessage);
  }
};

/** Claim reward for a completed mission — GET /missions/collect/:missionId */
export const collectMission = async (missionId: string): Promise<unknown> => {
  try {
    const response = await api.post(API_URLS.collectMission(missionId));
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to collect mission";
    throw new Error(errorMessage);
  }
};
