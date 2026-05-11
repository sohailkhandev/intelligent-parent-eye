import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { GradientButton, OutlineButton } from "@components";
import { MarketData } from "@types";
import { PointsIcon } from "@assets/icons/svg";
import { MarketApis } from "@apis";
import { useAppContext } from "@providers";

interface UnlockMarketDialogContentProps {
  market: MarketData;
  marketNumber: number;
  userPoints: number;
  onUnlock: () => void;
  onCancel: () => void;
}

const LockIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="5"
      y="11"
      width="14"
      height="11"
      rx="2"
      stroke="#0D9DFD"
      strokeWidth="2"
    />
    <path
      d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11"
      stroke="#0D9DFD"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1.5" fill="#0D9DFD" />
  </svg>
);

export const UnlockMarketDialogContent = ({
  market,
  marketNumber,
  userPoints,
  onUnlock,
  onCancel,
}: UnlockMarketDialogContentProps) => {
  const { showToast } = useAppContext();
  const purchaseMutation = MarketApis.usePurchaseMarket();
  const canAfford = userPoints >= (market.entryCost || 0);

  // Handle mutation results
  useEffect(() => {
    if (purchaseMutation.isSuccess) {
      showToast(
        `${market.label} unlocked! You now have ${market.entryCount} entries.`,
        "success"
      );
      onUnlock();
    }
    if (purchaseMutation.isError) {
      const error = purchaseMutation.error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to unlock market";
      showToast(message, "error");
    }
  }, [purchaseMutation.isSuccess, purchaseMutation.isError]);

  const handleUnlock = () => {
    purchaseMutation.mutate({ marketNumber });
  };

  return (
    <Box className="space-y-6">
      {/* Lock Icon */}
      <Box className="flex justify-center">
        <LockIcon />
      </Box>

      {/* Market Info */}
      <Box className="text-center">
        <Typography className="text-white text-2xl font-bold mb-2">
          {market.label}
        </Typography>
        <Typography className="text-white/60 text-base ">
          Unlock this market to start selling your photos
        </Typography>
      </Box>

      {/* Unlock Details */}
      <Box className="bg-[#0000004D] border border-[#0D9DFD1F] rounded-xl p-4 space-y-3">
        <Box className="flex items-center justify-between">
          <Typography className="text-white/60 text-sm ">
            Unlock Cost:
          </Typography>
          <Box className="flex items-center gap-2">
            <Box className="w-5 h-5">
              <PointsIcon width={20} height={20} />
            </Box>
            <Typography className="text-[#FFA600] text-lg font-bold ">
              {market.entryCost} Points
            </Typography>
          </Box>
        </Box>

        <Box className="flex items-center justify-between pt-2 border-t border-[#0D9DFD1F]">
          <Typography className="text-white/60 text-sm ">
            You'll Get:
          </Typography>
          <Typography className="text-[#00FF40] text-lg font-bold ">
            {market.entryCount} Entries
          </Typography>
        </Box>

        <Box className="flex items-center justify-between pt-2 border-t border-[#0D9DFD1F]">
          <Typography className="text-white/60 text-sm ">
            Your Points:
          </Typography>
          <Typography className="text-white text-lg font-bold ">
            {userPoints}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box className="flex flex-col sm:flex-row justify-center gap-4 max-w-[220px] mx-auto">
        <GradientButton
          onClick={handleUnlock}
          disabled={!canAfford || purchaseMutation.isPending}
        >
          {purchaseMutation.isPending
            ? "Unlocking..."
            : canAfford
              ? "Unlock Market"
              : "Not Enough Points"}
        </GradientButton>
        <OutlineButton onClick={onCancel}>Cancel</OutlineButton>
      </Box>
    </Box>
  );
};

export default UnlockMarketDialogContent;
