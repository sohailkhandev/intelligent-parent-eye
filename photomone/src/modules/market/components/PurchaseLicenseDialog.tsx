import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { MainDialog, MainButton, OutlineButton } from "@components";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { MarketApis } from "@apis";
import { COLORS } from "@constants";
import { prepareSuccessChime } from "@utils";

interface PurchaseLicenseDialogProps {
  open: boolean;
  onClose: () => void;
  purchasePoints: number;
  selectedPhotoUrl: string | null;
  slotId: string | null;
  marketName?: string;
  onPurchaseStateChange?: (isPending: boolean) => void;
  onPurchaseSuccess?: (data: {
    exposureAmount: number;
    marketName: string;
  }) => void;
}

export const PurchaseLicenseDialog = ({
  open,
  onClose,
  purchasePoints,
  selectedPhotoUrl,
  slotId,
  marketName = "",
  onPurchaseStateChange,
  onPurchaseSuccess,
}: PurchaseLicenseDialogProps) => {
  const { authUser } = useAuthContext();
  const { showToast } = useAppContext();

  const { translations } = useLanguage();
  const t = translations || {};
  const marketTranslations = t?.market || {};
  const purchaseDialog = marketTranslations?.purchaseDialog || {};
  const messages = marketTranslations?.messages || {};
  const purchaseImageMutation = MarketApis.usePurchaseImage();
  const licenseCost = purchasePoints;
  const canAfford = authUser?.points && authUser.points >= licenseCost;

  // Check if this is a free market (Market 1, 2, or 3)
  // const isFreeMarket = marketName === "Market 1" || marketName === "Market 2" || marketName === "Market 3";

  // On purchase success: notify parent so it can show congrats dialog and close this one.
  // Congrats is rendered in MarketScreen so it stays visible after this dialog closes.
  useEffect(() => {
    if (purchaseImageMutation.isSuccess && purchaseImageMutation.data?.data) {
      const exposureAmount =
        purchaseImageMutation.data.data.exposureAmount ?? 0;
      onPurchaseSuccess?.({
        exposureAmount,
        marketName: marketName || "Market",
      });
    }
  }, [
    purchaseImageMutation.isSuccess,
    purchaseImageMutation.data?.data,
    marketName,
    onPurchaseSuccess,
  ]);

  // Banner logic commented out - no promotion dialogs shown
  // // Handle mutation results - show promotion dialog for free markets
  // useEffect(() => {
  //   if (purchaseImageMutation.isSuccess && !promotionShown) {
  //     showToast(messages.purchaseSuccess || "Photo license purchased successfully!", "success");

  //     console.log("purchaseImageMutation.isSuccess", promotionShown);

  //     if (isFreeMarket) {
  //       // Randomly pick one of the two promotion dialogs
  //       const randomDialog = Math.random() < 0.5 ? 'package' : 'social';

  //       // Show promotion dialog
  //       if (randomDialog === 'package') {
  //         promotionPackageDialog.show();
  //       } else {
  //         promotionSocialDialog.show();
  //       }

  //       setPromotionShown(true);
  //     } else {
  //       // For paid markets, show success dialog directly
  //       setShowSuccessDialog(true);
  //     }
  //   }
  // }, [purchaseImageMutation.isSuccess, showToast, messages.purchaseSuccess, isFreeMarket, promotionPackageDialog, promotionSocialDialog, promotionShown]);

  // // Show success dialog after promotion dialog closes
  // useEffect(() => {
  //   if (isFreeMarket && promotionShown && !showSuccessDialog) {
  //     const isPromotionOpen = promotionPackageDialog.open || promotionSocialDialog.open;

  //     // When promotion dialog closes, show success dialog
  //     if (!isPromotionOpen) {
  //       const timer = setTimeout(() => {
  //         setShowSuccessDialog(true);
  //       }, 300);

  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [isFreeMarket, promotionShown, promotionPackageDialog.open, promotionSocialDialog.open, showSuccessDialog]);

  useEffect(() => {
    if (purchaseImageMutation.isError) {
      const error = purchaseImageMutation.error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        error?.response?.data?.message ||
        error?.message ||
        messages.purchaseFailed ||
        "Failed to purchase photo license";
      showToast(message, "error");
    }
  }, [
    purchaseImageMutation.isError,
    purchaseImageMutation.error,
    showToast,
    messages.purchaseFailed,
  ]);

  useEffect(() => {
    onPurchaseStateChange?.(purchaseImageMutation.isPending ?? false);
  }, [purchaseImageMutation.isPending, onPurchaseStateChange]);

  const handlePurchase = () => {
    if (!slotId) {
      showToast(
        messages.slotIdMissing || "Slot ID is missing. Please select an image.",
        "error"
      );
      return;
    }
    prepareSuccessChime(); // Unlock audio on user gesture so success chime can play after API response
    purchaseImageMutation.mutate({ slotId });
  };

  // const handleSuccessConfirm = () => {
  //   // Reset states
  //   setShowSuccessDialog(false);
  //   // setPromotionShown(false);

  //   // Navigate first to prevent blink, then refresh user
  //   // Don't close dialog - navigation will unmount the component
  //   navigate(`/dashboard/${ROUTES.result}`);
  //   // Use setTimeout to ensure navigation completes before refresh
  //   setTimeout(() => {
  //     refreshUser();
  //   }, 0);
  // };

  // Reset state when main dialog closes
  useEffect(() => {
    if (!open) {
      onPurchaseStateChange?.(false);
    }
  }, [open, onPurchaseStateChange]);

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={purchaseDialog.title || "Purchase Photo License"}
      maxWidth="sm"
    >
      <Box className="space-y-6 py-2 mt-2">
        {/* Box wrapper: photo + license (light gray bg, light blue border) */}
        <Box
          className="rounded-xl p-4 space-y-4"
          sx={{
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {/* Selected Photo Preview - teal border */}
          {selectedPhotoUrl && (
            <Box className="text-center">
              <Box
                className="w-54 h-54 mx-auto rounded-xl overflow-hidden border-2"
                sx={{ borderColor: COLORS.primary }}
              >
                <Box
                  component="img"
                  src={selectedPhotoUrl}
                  alt="Selected photo"
                  className="w-full h-full object-cover"
                />
              </Box>
            </Box>
          )}

          {/* License Duration - label red/pink, description black */}
          <Box className="text-left">
            <Typography variant="body1" className="text-sm">
              <span
                className="font-semibold"
                style={{ color: COLORS.secondary }}
              >
                {purchaseDialog.licenseDuration || "License Duration:"}
              </span>{" "}
              <span style={{ color: "#26262C" }}>
                {purchaseDialog.licenseDescription ||
                  "Resale allowed during the active period only."}
              </span>
            </Typography>
          </Box>
        </Box>

        {/* Actions - side by side: Cancel left, Confirm right (match other dialogs) */}
        <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
          <OutlineButton
            onClick={onClose}
            disabled={purchaseImageMutation.isPending}
            className="flex-1 !min-w-[120px]"
          >
            {purchaseDialog.cancel || "Cancel"}
          </OutlineButton>
          <MainButton
            onClick={handlePurchase}
            disabled={
              !canAfford || !selectedPhotoUrl || purchaseImageMutation.isPending
            }
            color={COLORS.primary}
            className="flex-1 !min-w-[120px]"
          >
            {purchaseImageMutation.isPending
              ? purchaseDialog.processing || "Purchasing..."
              : purchaseDialog.confirm || "Confirm"}
          </MainButton>
        </Box>
      </Box>

      {/* Success Confirmation Dialog */}
      {/* <MainDialog
        open={showSuccessDialog}
        onClose={() => {}}
        title={successDialog.title || "Purchase Successful"}
        maxWidth="sm"
        disableClose={true}
      >
        <Box className="space-y-6 py-2">
          <Typography
            variant="body1"
            className="text-white text-center text-sm leading-relaxed font-proxima"
          >
            {successDialog.message || "Your photo portrait is now being exposed to 4 other users and is currently on sale. You can check the result shortly on the Result page."}
          </Typography>

          <Box className="flex flex-col gap-3 justify-center items-center flex-wrap pt-4 max-w-[220px] mx-auto">
            <GradientButton
              onClick={handleSuccessConfirm}
              className="w-full"
            >
              {successDialog.ok || "OK"}
            </GradientButton>
          </Box>
        </Box>
      </MainDialog> */}
    </MainDialog>
  );
};

export default PurchaseLicenseDialog;
