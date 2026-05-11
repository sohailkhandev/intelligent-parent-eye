import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PurchaseService } from "@services";

export const useGetPurchasedImages = () =>
  useQuery({
    queryKey: ["purchasedImages"],
    queryFn: PurchaseService.getPurchasedImages,
  });

export const useBuyPurchasedImageSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { quantity: number }) => PurchaseService.buyPurchasedImageSlot(params),
    onSuccess: () => {
      // Invalidate purchased images to refresh the list
      queryClient.invalidateQueries({ queryKey: ["purchasedImages"] });
      // Invalidate auth user to refresh points
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};

