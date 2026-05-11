import { API_URLS } from "@constants";
import { ApiUtils, getErrorMessage } from "@utils";

export const updateParentProfile = async ({
  fullName,
}: {
  fullName: string;
}) => {
  try {
    const response = await ApiUtils.api.put(API_URLS.me, { fullName });
    return response.data;
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Failed to update profile. Please try again."
    );
    throw new Error(message);
  }
};
