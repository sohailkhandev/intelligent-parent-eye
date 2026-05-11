import { useEffect } from "react";
import { Box } from "@mui/material";
import { CardTitle, MainButton } from "@components";
import { ShopApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { COLORS } from "@constants";

interface PointsPackageCardProps {
  id: string;
  title: string;
  price: string;
  points: string;
  bonus?: string;
  description: string;
  featured?: boolean;
  badge?: string;
}

export const PointsPackageCard = ({
  id,
  title,
  price,
  points,
  bonus,
  description,
}: PointsPackageCardProps) => {
  const checkoutMutation = ShopApis.useCheckoutShopPackage();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();

  const t = translations || {};
  const shop = t.shop || {};
  const pointsPackage = shop.pointsPackage || {};
  const pointsLine = bonus ? `${points} + ${bonus}` : points;
  const descriptionAmountMatch = description.match(/(\$[\d,]+(?:\.\d+)?)/);
  const descriptionAmount = descriptionAmountMatch?.[1];

  const handlePurchase = () => {
    checkoutMutation.mutate({ packType: id });
  };

  // Handle success - redirect to checkout URL
  useEffect(() => {
    if (checkoutMutation.isSuccess && checkoutMutation.data?.data?.url) {
      window.location.href = checkoutMutation.data.data.url;
    }
  }, [checkoutMutation.isSuccess, checkoutMutation.data]);

  // Handle error
  useEffect(() => {
    if (checkoutMutation.isError) {
      const error = checkoutMutation.error as any;
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        pointsPackage.purchaseFailed ||
        "Purchase failed. Please try again.";
      showToast(errorMessage, "error");
    }
  }, [
    checkoutMutation.isError,
    checkoutMutation.error,
    showToast,
    pointsPackage,
  ]);

  return (
    <Box
      className="relative w-full rounded-2xl p-4 transition-all duration-300 border"
      sx={{ borderColor: COLORS.border }}
    >
      {/* Header */}
      <Box className="flex items-start justify-between gap-3 mb-4">
        <CardTitle title={title} />
        <span className="shrink-0 font-proxima font-bold text-[18px] md:text-[20px] leading-none text-[#2B2E34]">
          {price}
        </span>
      </Box>

      {/* Features list */}
      <Box className="mb-5">
        <ul className="space-y-2">
          <li className="flex items-center gap-2.5">
            <Box className="w-2 h-2 rounded-full bg-[#FA949D] shrink-0 mt-1" />
            <span className="font-proxima text-[14px] md:text-[15px] leading-[1.35] text-[#2B2E34]">
              <span className="font-bold text-[#F59A00]">{pointsLine}</span>{" "}
              <span>{pointsPackage.points || "Points"}</span>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Box className="w-2 h-2 rounded-full bg-[#FA949D] shrink-0 mt-2" />
            <span className="font-proxima text-[14px] md:text-[15px] leading-[1.35] text-[#2B2E34]">
              {descriptionAmount ? (
                <>
                  <span>
                    {description.replace(descriptionAmount, "").trim()}
                  </span>{" "}
                  <span className="font-bold">{descriptionAmount}</span>
                </>
              ) : (
                description
              )}
            </span>
          </li>
        </ul>
      </Box>

      {/* Individual Purchase Button */}
      <Box className="mt-2 text-center">
        <MainButton
          onClick={handlePurchase}
          color={COLORS.primary}
          disabled={checkoutMutation.isPending}
          className="!w-full !max-w-none !mx-0 !text-[15px] !py-3 !min-h-0 !font-semibold"
        >
          {checkoutMutation.isPending ? (
            <Box className="flex items-center justify-center gap-2">
              <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>{pointsPackage.processing || "Processing..."}</span>
            </Box>
          ) : (
            pointsPackage.purchaseNow || "Purchase Now"
          )}
        </MainButton>
      </Box>
    </Box>
  );
};

export default PointsPackageCard;
