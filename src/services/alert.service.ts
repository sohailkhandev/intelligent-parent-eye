import { API_URLS } from "@constants";
import { IAlert } from "@types";
import { ApiUtils, getErrorMessage } from "@utils";

export const getAlerts = async (): Promise<{
  status: string;
  data: {
    alerts: IAlert[];
  };
}> => {
  try {
    const response = await ApiUtils.api.get<{
      status: string;
      data: {
        alerts: IAlert[];
      };
    }>(API_URLS.alerts);

    return response.data;
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Failed to load alerts. Please try again."
    );
    throw new Error(message);
  }
};
