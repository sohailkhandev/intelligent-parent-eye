import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { MainButton, OutlineButton, MainDialog, Loading } from "@components";
import { PurchaseApis } from "@apis";
import { useAppContext, useAuthContext, useLanguage } from "@providers";
import { COLORS } from "@constants";

interface ResultPurchaseSlotDialogProps {
  open: boolean;
  onClose: () => void;
  currentSlots: number;
}

export const ResultPurchaseSlotDialog = ({
  open,
  onClose,
  currentSlots,
}: ResultPurchaseSlotDialogProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const purchaseDialog = resultTranslations?.purchaseDialog || {};
  const messages = resultTranslations?.messages || {};
  const [slotsToAdd, setSlotsToAdd] = useState(1);
  const { showToast } = useAppContext();
  const { authUser, refreshUser } = useAuthContext();
  const buySlotMutation = PurchaseApis.useBuyPurchasedImageSlot();

  const userPoints = authUser?.points ?? 0;
  const SLOT_COST = 500;
  const MAX_SLOTS_TO_BUY = 30;
  const totalCost = slotsToAdd * SLOT_COST;
  const canAfford = userPoints >= totalCost;
  const maxCanAdd = Math.floor(userPoints / SLOT_COST);
  const maxAllowed = Math.max(0, MAX_SLOTS_TO_BUY - currentSlots);

  const handleIncrement = () => {
    const newValue = slotsToAdd + 1;
    const maxPossible = Math.min(maxAllowed, maxCanAdd);
    if (newValue <= maxPossible) {
      setSlotsToAdd(newValue);
    }
  };

  const handleDecrement = () => {
    if (slotsToAdd > 1) {
      setSlotsToAdd(slotsToAdd - 1);
    }
  };

  const handlePurchase = () => {
    buySlotMutation.mutate(
      { quantity: slotsToAdd },
      {
        onSuccess: () => {
          const slotsLabel =
            slotsToAdd === 1
              ? purchaseDialog.slot || "slot"
              : purchaseDialog.slots || "slots";
          const successMessage = (
            messages.purchaseSuccess ||
            "Successfully purchased {count} {slotsLabel}!"
          )
            .replace("{count}", slotsToAdd.toString())
            .replace("{slotsLabel}", slotsLabel);
          showToast(successMessage, "success");
          refreshUser(); // Refresh user points
          handleClose();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            messages.purchaseFailed ||
            "Failed to purchase slots. Please try again.";
          showToast(errorMessage, "error");
        },
      }
    );
  };

  const handleClose = () => {
    setSlotsToAdd(1);
    onClose();
  };

  return (
    <MainDialog
      open={open}
      onClose={handleClose}
      title={purchaseDialog.title || "Purchase"}
      maxWidth="sm"
    >
      <Box
        className="rounded-2xl border p-4 sm:p-6 space-y-6 mt-6"
        sx={{ borderColor: COLORS.border }}
      >
        {/* Quantity: minus / number / plus */}
        <Box className="flex items-center justify-center gap-4">
          <IconButton
            onClick={handleDecrement}
            disabled={slotsToAdd <= 1}
            className="!w-12 !h-12 !rounded-full !transition-all !duration-200 hover:!scale-105 disabled:!opacity-50 disabled:!cursor-not-allowed"
            sx={{
              backgroundColor: `${COLORS.primary}20`,
              border: `1px solid ${COLORS.primary}`,
              color: COLORS.primary,
              "&:hover": {
                backgroundColor: `${COLORS.primary}30`,
              },
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Box className="text-center min-w-16">
            <Typography
              variant="h3"
              className="!text-3xl !font-bold !mb-0"
              sx={{ color: COLORS.generalText }}
            >
              {slotsToAdd}
            </Typography>
            <Typography variant="body2" sx={{ color: "#758599" }} className="">
              {slotsToAdd !== 1
                ? purchaseDialog.slots || "slots"
                : purchaseDialog.slot || "slot"}
            </Typography>
          </Box>

          <IconButton
            onClick={handleIncrement}
            disabled={slotsToAdd >= Math.min(maxAllowed, maxCanAdd)}
            className="!w-12 !h-12 !rounded-full !transition-all !duration-200 hover:!scale-105 disabled:!opacity-50 disabled:!cursor-not-allowed"
            sx={{
              backgroundColor: `${COLORS.primary}20`,
              border: `1px solid ${COLORS.primary}`,
              color: COLORS.primary,
              "&:hover": {
                backgroundColor: `${COLORS.primary}30`,
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Cost Summary - light gray rounded area */}
        <Box
          className="rounded-xl p-4"
          sx={{
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Box className="flex justify-between items-center mb-2">
            <Typography
              variant="body2"
              sx={{ color: "#758599" }}
              className="!font-medium "
            >
              {purchaseDialog.totalCost || "Total Cost:"}
            </Typography>
            <Typography
              variant="h6"
              className="!font-bold "
              sx={{ color: canAfford ? COLORS.primary : "#DE1C39" }}
            >
              {totalCost.toLocaleString()} {purchaseDialog.points || "points"}
            </Typography>
          </Box>
          <Box className="flex justify-between items-center">
            <Typography
              variant="body2"
              sx={{ color: "#758599" }}
              className="!font-medium "
            >
              {purchaseDialog.yourPoints || "Your Points:"}
            </Typography>
            <Typography
              variant="body2"
              className="!font-bold "
              sx={{ color: COLORS.generalText }}
            >
              {userPoints.toLocaleString()}
            </Typography>
          </Box>
          {!canAfford && (
            <Box
              className="mt-3 p-2 rounded-lg"
              sx={{ backgroundColor: "#FEE2E2", border: "1px solid #FECACA" }}
            >
              <Typography
                variant="body2"
                className="!text-[#DE1C39] !text-center !font-medium "
              >
                {(
                  purchaseDialog.insufficientPoints ||
                  "Insufficient points! You need {totalCost} points."
                ).replace("{totalCost}", totalCost.toLocaleString())}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Actions - horizontal: Cancel left, Purchase right (same as other dialogs) */}
        <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
          <OutlineButton
            onClick={handleClose}
            disabled={buySlotMutation.isPending}
            className="flex-1 !min-w-[120px]"
          >
            {purchaseDialog.cancel || "Cancel"}
          </OutlineButton>
          <MainButton
            type="button"
            onClick={handlePurchase}
            disabled={
              !canAfford ||
              slotsToAdd <= 0 ||
              slotsToAdd > maxAllowed ||
              buySlotMutation.isPending
            }
            color={COLORS.primary}
            className="flex-1 !min-w-[120px]"
          >
            {buySlotMutation.isPending ? (
              <Box className="flex items-center justify-center gap-2">
                <Loading size={16} />
                <span>{purchaseDialog.processing || "Processing..."}</span>
              </Box>
            ) : slotsToAdd !== 1 ? (
              (purchaseDialog.purchaseSlots || "Purchase {count} slots").replace(
                "{count}",
                String(slotsToAdd)
              )
            ) : (
              (purchaseDialog.purchaseSlot || "Purchase {count} slot").replace(
                "{count}",
                String(slotsToAdd)
              )
            )}
          </MainButton>
        </Box>
      </Box>
    </MainDialog>
  );
};

export default ResultPurchaseSlotDialog;
