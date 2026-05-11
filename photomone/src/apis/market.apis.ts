import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MarketService } from "@services";

export const useGetAllMarkets = () =>
  useQuery({
    queryKey: ["markets"],
    queryFn: MarketService.getAllMarkets,
  });

export const usePurchaseMarket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MarketService.purchaseMarket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
  });
};

export const useJoinMarket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MarketService.joinMarket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      queryClient.removeQueries({ queryKey: ["mainMarket"] });

      queryClient.refetchQueries({ queryKey: ["mainMarket"] });

      const pollMainMarket = async () => {
        const maxAttempts = 60;
        let attempts = 0;

        const pollInterval = setInterval(async () => {
          attempts++;

          try {
            // Call API directly so a 400/error does not overwrite the mainMarket cache
            // (fetchQuery would set the query to error state and break the market UI / congrats dialog)
            const result = await MarketService.getMainMarket();
            if (result?.data?.market?.totalSellers === 5) {
              clearInterval(pollInterval);
              queryClient.setQueryData(["mainMarket"], result);
              return;
            }

            if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
            }
          } catch {
            clearInterval(pollInterval);
            // Do not log or update cache – keep existing mainMarket data so UI (e.g. congrats dialog) stays visible
          }
        }, 1000); // Poll every 1 second
      };

      // Start polling after a short delay to allow the initial invalidation to complete
      setTimeout(() => {
        pollMainMarket();
      }, 1000);
    },
  });
};

export const useCreateExposures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MarketService.createExposures,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      queryClient.invalidateQueries({ queryKey: ["exposures"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const usePurchaseImage = () => {
  return useMutation({
    mutationFn: MarketService.purchaseImage,
    // Do not invalidate authUser here: refetch can return inMarket: false and cause
    // MarketContainer to show "not in market", unmounting the congrats dialog.
    // User is refreshed when they click OK on the congrats dialog (handleCongratsOk).
  });
};

export const useGetMainMarket = () =>
  useQuery({
    queryKey: ["mainMarket"],
    queryFn: MarketService.getMainMarket,
    staleTime: Infinity, // Fetch once when entering market screen; no refetch while there
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

export const useGetCompletedMarkets = () =>
  useQuery({
    queryKey: ["completedMarkets"],
    queryFn: MarketService.getCompletedMarkets,
  });

const DEFAULT_EXPOSURE_PAGE = 1;
const DEFAULT_EXPOSURE_LIMIT = 10;

export const useGetExposureResults = (page = DEFAULT_EXPOSURE_PAGE, limit = DEFAULT_EXPOSURE_LIMIT) =>
  useQuery({
    queryKey: ["exposureResults", page, limit],
    queryFn: () => MarketService.getExposureResults(page, limit),
  });

export const useGetExposures = () =>
  useQuery({
    queryKey: ["exposures"],
    queryFn: MarketService.getExposures,
  });
