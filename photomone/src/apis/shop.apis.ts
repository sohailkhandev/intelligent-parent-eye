import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShopService } from "@services";
import type { ShopCheckoutParams, PurchaseGiftCardParams } from "@types";

export const useGetShopPackages = () =>
  useQuery({
    queryKey: ["shopPackages"],
    queryFn: ShopService.getShopPackages,
  });

export const useGetMyPackages = (page: number) =>
  useQuery({
    queryKey: ["shopMyPackages", page],
    queryFn: () => ShopService.getMyPackages(page),
  });

export const useGetMyGiftCardPurchases = (page: number) =>
  useQuery({
    queryKey: ["giftShopMyPurchases", page],
    queryFn: () => ShopService.getMyGiftCardPurchases(page),
  });

export const useCheckoutShopPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ShopCheckoutParams) => ShopService.checkoutShopPackage(params),
    onSuccess: () => {
      // Invalidate user data to refresh points after purchase
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};

export const useGetGiftShop = () =>
  useQuery({
    queryKey: ["giftShop"],
    queryFn: ShopService.getGiftShop,
  });

export const usePurchaseGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PurchaseGiftCardParams) => ShopService.purchaseGiftCard(params),
    onSuccess: () => {
      // Invalidate user data to refresh points after purchase
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Invalidate gift shop to refresh canPurchase status
      queryClient.invalidateQueries({ queryKey: ["giftShop"] });
      // Invalidate notifications to refresh after purchase
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

