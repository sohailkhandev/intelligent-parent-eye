import { API_URLS } from "@constants";
import { IChildApp, IChildAppFilter } from "@types";
import { ApiUtils, getErrorMessage } from "@utils";

const normalizeChildApps = (value: unknown): IChildApp[] => {
  if (Array.isArray(value)) {
    return value as IChildApp[];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;

  if (Array.isArray(record.apps)) {
    return record.apps as IChildApp[];
  }

  return Object.values(record).flatMap((entry) =>
    Array.isArray(entry) ? (entry as IChildApp[]) : []
  );
};

export const getChildApps = async (
  {
    childId,
    filter,
  }: {
    childId: string;
    filter: IChildAppFilter;
  },
): Promise<{
  status: string;
  data: IChildApp[];
}> => {
  try {
    const response = await ApiUtils.api.get<{
      status: string;
      data: unknown;
    }>(`${API_URLS.childApps}/${childId}`, {
      params: { filter },
    });

    return {
      status: response.data.status,
      data: normalizeChildApps(response.data.data),
    };
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Failed to load child apps. Please try again."
    );
    throw new Error(message);
  }
};

export const updateChildAppRestriction = async ({
  childId,
  appId,
  blocked,
}: {
  childId: string;
  appId: string;
  blocked: boolean;
}): Promise<{
  status?: string;
  message?: string;
  data?: IChildApp;
}> => {
  try {
    const response = await ApiUtils.api.put<{
      status?: string;
      message?: string;
      data?: IChildApp;
    }>(`${API_URLS.childAppRestriction}/${childId}/apps/${appId}`, {
      blocked,
    });

    return response.data;
  } catch (err) {
    const message = getErrorMessage(
      err,
      `Failed to ${blocked ? "restrict" : "unrestrict"} app. Please try again.`
    );
    throw new Error(message);
  }
};
