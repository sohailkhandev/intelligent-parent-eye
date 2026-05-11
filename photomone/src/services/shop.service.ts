import { API_URLS } from "@constants";
import { api } from "@utils";
import type { 
  ShopPackagesResponse, 
  ShopCheckoutParams, 
  ShopCheckoutResponse, 
  GiftShopResponse,
  PurchaseGiftCardParams,
  PurchaseGiftCardResponse,
  MyPackagesResponse,
  GiftCardPurchasesResponse
} from "@types";

export const getShopPackages = async (): Promise<ShopPackagesResponse> => {
  const response = await api.get(API_URLS.shopPackages);
  return response.data;
};

export const getMyPackages = async (page: number): Promise<MyPackagesResponse> => {
  const response = await api.get(API_URLS.shopMyPackages, { params: { page } });
  return response.data;
};

export const checkoutShopPackage = async (params: ShopCheckoutParams): Promise<ShopCheckoutResponse> => {
  const response = await api.post(
    API_URLS.shopCheckout, 
    params,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getGiftShop = async (): Promise<GiftShopResponse> => {
  const response = await api.get(API_URLS.giftShop);
  return response.data;
};

export const purchaseGiftCard = async (params: PurchaseGiftCardParams): Promise<PurchaseGiftCardResponse> => {
  const response = await api.post(API_URLS.purchaseGiftCard, params);
  return response.data;
};

export const getMyGiftCardPurchases = async (page: number): Promise<GiftCardPurchasesResponse> => {
  const response = await api.get(API_URLS.giftShopMyPurchases, { params: { page } });
  return response.data;
};

