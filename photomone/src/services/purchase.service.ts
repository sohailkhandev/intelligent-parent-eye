import { API_URLS } from "@constants";
import { api } from "@utils";
import type { PurchasedImagesResponse, BuyPurchasedImageSlotParams, BuyPurchasedImageSlotResponse } from "@types";

export const getPurchasedImages = async (): Promise<PurchasedImagesResponse> => {
  const response = await api.get(API_URLS.purchasedImages);
  return response.data;
};

export const buyPurchasedImageSlot = async (params: BuyPurchasedImageSlotParams): Promise<BuyPurchasedImageSlotResponse> => {
  const response = await api.post(API_URLS.buyPurchasedImageSlot, params);
  return response.data;
};

