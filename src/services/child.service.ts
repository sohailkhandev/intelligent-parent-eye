import { API_URLS } from "@constants";
import { ApiUtils, getErrorMessage } from "@utils";

export const deleteChild = async (childId: string) => {
  try {
    const response = await ApiUtils.api.delete(`${API_URLS.children}/${childId}`);
    return response.data;
  } catch (err) {
    const message = getErrorMessage(
      err,
      "Failed to delete child. Please try again."
    );
    throw new Error(message);
  }
};
