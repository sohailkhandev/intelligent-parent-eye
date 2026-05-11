import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  ExposureBatchEndedPayload,
  MarketEventPayload,
  MissionCompletedSocketPayload,
} from "@types";

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  severity: ToastSeverity;
  /** When set, toast shows this image as thumbnail instead of severity icon (e.g. photoUnsold) */
  imageUrl?: string;
}

interface AppContextType {
  toasts: ToastItem[];
  showToast: (message: string, severity?: ToastSeverity, options?: { imageUrl?: string }) => void;
  hideToast: (id: string) => void;
  promotionPackageDialog: {
    open: boolean;
    show: () => void;
    hide: () => void;
  };
  promotionSocialDialog: {
    open: boolean;
    show: () => void;
    hide: () => void;
  };
  marketSaleSuccessPopup: {
    open: boolean;
    payload: MarketEventPayload | null;
    show: (payload: MarketEventPayload) => void;
    hide: () => void;
  };
  sellingReportDialog: {
    open: boolean;
    payload: ExposureBatchEndedPayload | null;
    show: (payload: ExposureBatchEndedPayload) => void;
    hide: () => void;
  };
  missionCompletedDialog: {
    open: boolean;
    payload: MissionCompletedSocketPayload | null;
    show: (payload: MissionCompletedSocketPayload) => void;
    hide: () => void;
  };
}

const AppContext = createContext<AppContextType>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
  promotionPackageDialog: {
    open: false,
    show: () => {},
    hide: () => {},
  },
  promotionSocialDialog: {
    open: false,
    show: () => {},
    hide: () => {},
  },
  marketSaleSuccessPopup: {
    open: false,
    payload: null,
    show: () => {},
    hide: () => {},
  },
  sellingReportDialog: {
    open: false,
    payload: null,
    show: () => {},
    hide: () => {},
  },
  missionCompletedDialog: {
    open: false,
    payload: null,
    show: () => {},
    hide: () => {},
  },
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [promotionPackageDialogOpen, setPromotionPackageDialogOpen] =
    useState(false);
  const [promotionSocialDialogOpen, setPromotionSocialDialogOpen] =
    useState(false);
  const [marketSaleSuccessPopupOpen, setMarketSaleSuccessPopupOpen] =
    useState(false);
  const [marketSaleSuccessPopupPayload, setMarketSaleSuccessPopupPayload] =
    useState<MarketEventPayload | null>(null);
  const [sellingReportDialogOpen, setSellingReportDialogOpen] = useState(false);
  const [sellingReportDialogPayload, setSellingReportDialogPayload] =
    useState<ExposureBatchEndedPayload | null>(null);
  const [missionCompletedDialogOpen, setMissionCompletedDialogOpen] =
    useState(false);
  const [missionCompletedDialogPayload, setMissionCompletedDialogPayload] =
    useState<MissionCompletedSocketPayload | null>(null);

  const showToast = useCallback(
    (message: string, severity: ToastSeverity = "info", options?: { imageUrl?: string }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [
        { id, message, severity, imageUrl: options?.imageUrl },
        ...prev,
      ]);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showPromotionPackageDialog = useCallback(() => {
    setPromotionPackageDialogOpen(true);
  }, []);

  const hidePromotionPackageDialog = useCallback(() => {
    setPromotionPackageDialogOpen(false);
  }, []);

  const showPromotionSocialDialog = useCallback(() => {
    setPromotionSocialDialogOpen(true);
  }, []);

  const hidePromotionSocialDialog = useCallback(() => {
    setPromotionSocialDialogOpen(false);
  }, []);

  const showMarketSaleSuccessPopup = useCallback(
    (payload: MarketEventPayload) => {
      setMarketSaleSuccessPopupPayload(payload);
      setMarketSaleSuccessPopupOpen(true);
    },
    []
  );

  const hideMarketSaleSuccessPopup = useCallback(() => {
    setMarketSaleSuccessPopupOpen(false);
    setMarketSaleSuccessPopupPayload(null);
  }, []);

  const showSellingReportDialog = useCallback(
    (payload: ExposureBatchEndedPayload) => {
      setSellingReportDialogPayload(payload);
      setSellingReportDialogOpen(true);
    },
    []
  );

  const hideSellingReportDialog = useCallback(() => {
    setSellingReportDialogOpen(false);
    setSellingReportDialogPayload(null);
  }, []);

  const showMissionCompletedDialog = useCallback(
    (payload: MissionCompletedSocketPayload) => {
      setMissionCompletedDialogPayload(payload);
      setMissionCompletedDialogOpen(true);
    },
    []
  );

  const hideMissionCompletedDialog = useCallback(() => {
    setMissionCompletedDialogOpen(false);
    setMissionCompletedDialogPayload(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        toasts,
        showToast,
        hideToast,
        promotionPackageDialog: {
          open: promotionPackageDialogOpen,
          show: showPromotionPackageDialog,
          hide: hidePromotionPackageDialog,
        },
        promotionSocialDialog: {
          open: promotionSocialDialogOpen,
          show: showPromotionSocialDialog,
          hide: hidePromotionSocialDialog,
        },
        marketSaleSuccessPopup: {
          open: marketSaleSuccessPopupOpen,
          payload: marketSaleSuccessPopupPayload,
          show: showMarketSaleSuccessPopup,
          hide: hideMarketSaleSuccessPopup,
        },
        sellingReportDialog: {
          open: sellingReportDialogOpen,
          payload: sellingReportDialogPayload,
          show: showSellingReportDialog,
          hide: hideSellingReportDialog,
        },
        missionCompletedDialog: {
          open: missionCompletedDialogOpen,
          payload: missionCompletedDialogPayload,
          show: showMissionCompletedDialog,
          hide: hideMissionCompletedDialog,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
