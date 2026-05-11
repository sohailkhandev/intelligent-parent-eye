import { Box, Typography } from "@mui/material";
import { useState } from "react";
import {
  CardTitle,
  Loading,
  MainButton,
  MainDialog,
  OutlineButton,
  ThemeText,
} from "@components";
// import { PointsIcon } from "@assets/icons/svg";
import amazonCard from "@assets/images/amazonCard.png";
import googlePlayCard from "@assets/images/googlePlayCard.png";
import appleItunesCard from "@assets/images/appleItunesCard.png";
import visaMasterCard from "@assets/images/VisaMasterCard.png";
import { ShopApis } from "@apis";
import { useAppContext, useAuthContext, useLanguage } from "@providers";
import type { GiftShopItem } from "@types";
import { COLORS } from "@constants";

interface GiftCardProps {
  giftCard: GiftShopItem;
}

export const GiftCard = ({ giftCard }: GiftCardProps) => {
  const { showToast } = useAppContext();
  const { authUser, refreshUser } = useAuthContext();
  const { translations } = useLanguage();
  const purchaseGiftCardMutation = ShopApis.usePurchaseGiftCard();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const userPoints = authUser?.points ?? 0;
  const t = translations || {};
  const shop = t.shop || {};
  const giftCardT = shop.giftCard || {};

  const canAfford = userPoints >= giftCard.totalPoints && giftCard.canPurchase;
  const isPending = purchaseGiftCardMutation.isPending;
  const cardName = giftCard.name.toLowerCase();
  const previewImage = cardName.includes("amazon")
    ? amazonCard
    : cardName.includes("google")
      ? googlePlayCard
      : cardName.includes("apple") || cardName.includes("itunes")
        ? appleItunesCard
        : cardName.includes("visa") || cardName.includes("master")
          ? visaMasterCard
          : amazonCard;

  const handlePurchaseClick = () => {
    if (!canAfford || isPending) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmPurchase = () => {
    purchaseGiftCardMutation.mutate(
      { giftId: giftCard.id },
      {
        onSuccess: () => {
          const successMsg = (
            giftCardT.purchaseSuccessMessage ||
            "Successfully purchased {name} gift card!"
          ).replace("{name}", giftCard.name);
          showToast(successMsg, "success");
          refreshUser(); // Refresh user points
          setShowConfirmDialog(false);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            giftCardT.purchaseFailedMessage ||
            "Failed to purchase gift card. Please try again.";
          showToast(errorMessage, "error");
        },
      }
    );
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
  };

  return (
    <Box
      className="border !rounded-2xl !p-3 md:!p-3 transition-all duration-200"
      sx={{ borderColor: COLORS.border }}
    >
      <Box className="flex flex-col gap-3">
        <Box className="w-full rounded-xl p-4 flex items-center justify-center min-h-[110px] bg-[linear-gradient(90deg,#FFE0E0_0%,#B9F8FF_100%)]">
          <Box
            component="img"
            src={previewImage}
            alt={`${giftCard.name} preview`}
            className="object-contain"
          />
        </Box>

        <Box className="flex items-start justify-between gap-3 mt-2">
          <Box className="h-[40px] w-[40px] flex items-center justify-center overflow-hidden rounded-md">
            {giftCard.logo && (
              <Box
                component="img"
                src={giftCard.logo}
                alt={giftCard.name}
                className="h-full w-full object-cover"
              />
            )}
          </Box>
          <Box className="text-right">
            <Typography className="text-xl font-bold font-proxima">
              ${giftCard.price}
            </Typography>
            <Typography className="text-[9px]" sx={{ color: COLORS.primary }}>
              {giftCardT.giftCard || "Gift Card"}
            </Typography>
          </Box>
        </Box>

        <CardTitle title={giftCard.name} />

        {/* <Box className="flex items-center gap-2">
          <Box sx={{ boxShadow: `0 0 10px -5px #758599`, borderRadius: "50%" }}>
            <PointsIcon />
          </Box>
          <Typography className="text-[#F59E0B] text-sm font-semibold">
            {giftCard.points.toLocaleString()} {giftCardT.points || "Points"}
          </Typography>
        </Box> */}

        <MainButton
          onClick={handlePurchaseClick}
          disabled={!canAfford || isPending}
          className="mt-2"
        >
          {isPending ? (
            <Box className="flex items-center justify-center gap-2">
              <Loading size={16} />
              <span>{giftCardT.processing || "Processing..."}</span>
            </Box>
          ) : canAfford ? (
            giftCardT.redeemNow || giftCardT.purchase || "Redeem Now"
          ) : (
            giftCardT.notEnoughPoints || "Not Enough Points"
          )}
        </MainButton>
      </Box>

      {/* Confirmation Dialog */}
      <MainDialog
        open={showConfirmDialog}
        onClose={handleCancelDialog}
        title={giftCardT.confirmPurchase || "Confirm"}
        maxWidth="md"
      >
        <Box className="space-y-4 py-1">
          <Box className="space-y-3">
            <Box className="my-6">
              <ThemeText
                text={(
                  giftCardT.receiveMessage ||
                  "You will receive your {name} gift card through email upon admin's approval."
                ).replace("{name}", giftCard.name)}
              />
            </Box>

            <Box
              className="rounded-xl p-4 border"
              sx={{ borderColor: COLORS.border }}
            >
              <CardTitle
                title={giftCardT.important || "Important:"}
                className="mb-2"
              />
              <Typography className="text-[#758599] text-sm">
                {giftCardT.companyChargeMessage ||
                  "A 15% company charge will be deducted from your account in addition to the gift card cost."}
              </Typography>
            </Box>

            <Box
              className="rounded-xl px-4 py-6 border"
              sx={{ borderColor: COLORS.border }}
            >
              <Box className="space-y-4">
                <Box
                  className="flex items-center justify-between border-b pb-4"
                  sx={{ borderColor: COLORS.border }}
                >
                  <Typography
                    variant="body2"
                    className="text-[#758599] text-sm font-medium"
                  >
                    {giftCardT.giftCardCost || "Gift Card Cost:"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-[#F59A00] text-sm font-semibold"
                  >
                    {`$${giftCard.price}`}
                    
                  </Typography>
                </Box>

                <Box className="flex items-center justify-between">
                  <Typography
                    variant="body2"
                    className="text-[#758599] text-sm font-medium"
                  >
                    {giftCardT.companyCharge || "Company Charge (15%):"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-[#F59A00] text-sm font-semibold"
                  >
                      {`$${giftCard.companyCost}`}
                  </Typography>
                </Box>

                <Box
                  className="flex items-center justify-between pt-2 border-t"
                  sx={{ borderColor: COLORS.border }}
                >
                  <Typography
                    variant="body1"
                    className="text-[#2D3038] text-xl font-semibold"
                  >
                    {giftCardT.total || "Total:"}
                  </Typography>
                  <Typography
                    className="text-xl font-bold"
                    sx={{ color: COLORS.primary }}
                  >
                    {`$${giftCard.totalPoints}`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {userPoints < giftCard.totalPoints && (
              <Box className="rounded-lg p-3 border bg-[#FFF4F4] border-[#FA949D66]">
                <Typography
                  variant="body2"
                  className="text-[#E35D69] text-center font-medium text-sm"
                >
                  {(
                    giftCardT.insufficientPoints ||
                    "Insufficient points! You need {totalPoints} points (including company charge)."
                  ).replace(
                    "{totalPoints}",
                    giftCard.totalPoints.toLocaleString()
                  )}
                </Typography>
              </Box>
            )}
          </Box>

          <Box className="flex gap-3 justify-between mt-10">
            <OutlineButton
              onClick={handleCancelDialog}
              className="!w-full"
              disabled={isPending}
            >
              {giftCardT.cancel || "Cancel"}
            </OutlineButton>
            <MainButton
              onClick={handleConfirmPurchase}
              color={COLORS.primary}
              disabled={userPoints < giftCard.totalPoints || isPending}
              className="!w-full"
            >
              {isPending ? (
                <Box className="flex items-center justify-center gap-2">
                  <Loading size={16} />
                  <span>{giftCardT.processing || "Processing..."}</span>
                </Box>
              ) : (
                giftCardT.confirmPurchase || "Confirm"
              )}
            </MainButton>
          </Box>
        </Box>
      </MainDialog>
    </Box>
  );
};
