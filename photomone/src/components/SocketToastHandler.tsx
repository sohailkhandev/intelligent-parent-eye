import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { SocketService } from "@services";
import { translateMarketName } from "@utils";
import type { ExposureBatchEndedPayload, MarketEventPayload } from "@types";

const EXPOSURE_RESULTS_QUERY_KEY = ["exposureResults"] as const;
const MARKETS_QUERY_KEY = ["markets"] as const;
const SLOTS_QUERY_KEY = ["slots"] as const;

export const SocketToastHandler = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthContext();
  const {
    showToast,
    marketSaleSuccessPopup,
    sellingReportDialog,
    missionCompletedDialog,
  } = useAppContext();
  const { translations } = useLanguage();

  useEffect(() => {
    if (!isLoggedIn) {
      SocketService.setMissionCompletedDialogCallback(null);
      return;
    }
    SocketService.setMissionCompletedDialogCallback((payload) => {
      missionCompletedDialog.show(payload);
      void queryClient.invalidateQueries({ queryKey: ["missions"] });
    });
    return () => SocketService.setMissionCompletedDialogCallback(null);
  }, [isLoggedIn, missionCompletedDialog.show, queryClient]);

  useEffect(() => {
    if (!isLoggedIn) {
      SocketService.setMarketEventCallback(null);
      return;
    }
    SocketService.setMarketEventCallback((event, data) => {
      if (event === "photoSold") {
        marketSaleSuccessPopup.show(data as MarketEventPayload);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      } else if (event === "exposureBatchEnded") {
        const batchPayload = data as ExposureBatchEndedPayload;
        sellingReportDialog.show(batchPayload);
      } else {
        const unsoldData = data as MarketEventPayload;
        const socketT = translations?.result?.socket || {};
        const rawName = unsoldData.marketName || "";
        const marketLabel =
          translateMarketName(rawName, translations) || rawName || "";
        const template =
          socketT.photoUnsold ||
          "Sale unsuccessful! Your photo did not make a sale in {market}.";
        const toastMessage = template.replace("{market}", marketLabel);
        showToast(toastMessage, "info", { imageUrl: unsoldData.imageUrl });
      }
      queryClient.invalidateQueries({ queryKey: EXPOSURE_RESULTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MARKETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SLOTS_QUERY_KEY });
    });
    return () => SocketService.setMarketEventCallback(null);
  }, [
    isLoggedIn,
    showToast,
    marketSaleSuccessPopup,
    sellingReportDialog,
    queryClient,
    translations,
  ]);

  return null;
};

export default SocketToastHandler;
