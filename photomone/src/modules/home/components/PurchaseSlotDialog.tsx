import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { MainButton, OutlineButton, MainDialog, Loading } from "@components";
import { SlotApis } from "@apis";
import { useAppContext, useAuthContext, useLanguage } from "@providers";
import { COLORS } from "@constants";

interface PurchaseSlotDialogProps {
  open: boolean;
  onClose: () => void;
  currentSlots: number;
  maxSlots: number;
}

export const PurchaseSlotDialog = ({
  open,
  onClose,
  currentSlots,
  maxSlots,
}: PurchaseSlotDialogProps) => {
  const { showToast } = useAppContext();
  const purchaseMutation = SlotApis.usePurchaseSlot();
  const { authUser, refreshUser } = useAuthContext();
  const { translations } = useLanguage();
  const [slotsToAdd, setSlotsToAdd] = useState(1);

  const t = translations || {};
  const home = t.home || {};
  const purchaseDialog = home.purchaseDialog || {};

  const userPoints = authUser?.points ?? 0;
  const SLOT_COST = 200;
  const totalCost = slotsToAdd * SLOT_COST;
  const canAfford = userPoints >= totalCost;
  const maxCanAdd = Math.floor(userPoints / SLOT_COST);
  const maxAllowed = Math.max(0, maxSlots - currentSlots);

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
    purchaseMutation.mutate(
      { quantity: slotsToAdd },
      {
        onSuccess: () => {
          refreshUser?.();
          const successMsg =
            slotsToAdd === 1
              ? (
                  purchaseDialog.purchaseSuccess ||
                  "Successfully purchased {slotsToAdd} slot!"
                ).replace("{slotsToAdd}", slotsToAdd.toString())
              : (
                  purchaseDialog.purchaseSuccessPlural ||
                  "Successfully purchased {slotsToAdd} slots!"
                ).replace("{slotsToAdd}", slotsToAdd.toString());
          showToast(successMsg, "success");
          handleClose();
        },
        onError: (error: {
          response?: { data?: { message?: string } };
          message?: string;
        }) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            purchaseDialog.purchaseFailed ||
            "Failed to purchase slot";
          showToast(message, "error");
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
            <Typography
              variant="body2"
              sx={{ color: "#758599" }}
              className="font-proxima"
            >
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
              className="!font-medium"
            >
              {purchaseDialog.totalCost || "Total Cost:"}
            </Typography>
            <Typography
              variant="h6"
              className="!font-bold"
              sx={{ color: canAfford ? COLORS.primary : "#DE1C39" }}
            >
              {totalCost.toLocaleString()}{" "}
              {purchaseDialog.pointsAbbrev || purchaseDialog.points || "pts"}
            </Typography>
          </Box>
          <Box className="flex justify-between items-center">
            <Typography
              variant="body2"
              sx={{ color: "#758599" }}
              className="!font-medium"
            >
              {purchaseDialog.yourPoints || "Your Points:"}
            </Typography>
            <Typography
              variant="body2"
              className="!font-bold"
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
                className="!text-[#DE1C39] !text-center !font-medium"
              >
                {(
                  purchaseDialog.insufficientPoints ||
                  "Insufficient points! You need {totalCost} points."
                ).replace("{totalCost}", totalCost.toLocaleString())}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Actions - horizontal: Cancel left, Purchase right */}
        <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
          <OutlineButton
            onClick={handleClose}
            disabled={purchaseMutation.isPending}
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
              purchaseMutation.isPending
            }
            color={COLORS.primary}
            className="flex-1 !min-w-[120px]"
          >
            {purchaseMutation.isPending ? (
              <Box className="flex items-center justify-center gap-2">
                <Loading size={16} />
                <span>{purchaseDialog.processing || "Processing..."}</span>
              </Box>
            ) : slotsToAdd === 1 ? (
              purchaseDialog.purchaseSlotButton ||
              `${purchaseDialog.purchase || "Purchase"} ${purchaseDialog.slot || "Slot"}`
            ) : (
              purchaseDialog.purchaseSlotsButton ||
              `${purchaseDialog.purchase || "Purchase"} ${purchaseDialog.slots || "Slots"}`
            )}
          </MainButton>
        </Box>
      </Box>
    </MainDialog>
  );
};

export default PurchaseSlotDialog;
