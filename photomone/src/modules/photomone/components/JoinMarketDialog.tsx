import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { MainDialog, MainButton, OutlineButton, PointsCard } from "@components";
import { MarketData } from "@types";
import { COLORS } from "@constants";
import { MarketApis } from "@apis";
import { useAuthContext, useAppContext, useLanguage } from "@providers";

interface JoinMarketDialogProps {
  open: boolean;
  onClose: () => void;
  market: MarketData | null;
  marketNumber: number | undefined;
}

export const JoinMarketDialog = ({
  open,
  onClose,
  market,
  marketNumber,
}: JoinMarketDialogProps) => {
  const { authUser, refreshUser } = useAuthContext();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const joinMarketMutation = MarketApis.useJoinMarket();
  const t = translations || {};
  const photomone = t.photomone || {};
  const joinMarketDialog = photomone.joinMarketDialog || {};
  const userPoints = authUser?.points ?? 0;
  const pointsCost = market?.purchasePoints ?? 0;

  useEffect(() => {
    if (joinMarketMutation.isSuccess) {
      refreshUser();
      onClose();
    }
  }, [joinMarketMutation.isSuccess, refreshUser, onClose]);

  useEffect(() => {
    if (joinMarketMutation.isError) {
      const error = joinMarketMutation.error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        error?.response?.data?.message ||
        error?.message ||
        joinMarketDialog.joinFailed ||
        joinMarketDialog.joinMarketFailed ||
        "Failed to join market";
      showToast(message, "error");
    }
  }, [joinMarketMutation.isError, joinMarketMutation.error, showToast]);

  // Reset mutation state when dialog closes so reopening works correctly
  useEffect(() => {
    if (!open) {
      joinMarketMutation.reset();
    }
  }, [open]);

  const handleJoin = () => {
    if (marketNumber == null) return;
    joinMarketMutation.mutate({ marketNumber });
  };

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={joinMarketDialog.title || "Join Market"}
      maxWidth="sm"
    >
      <Box className="space-y-6 py-2 mt-4">
        <PointsCard points={userPoints} className="mb-6" />

        <Box
          className="rounded-xl p-4 space-y-4"
          sx={{ border: `1px solid ${COLORS.border}` }}
        >
          {market && (
            <>
              <Box className="flex justify-between items-center">
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.grayStrong, fontWeight: 600 }}
                >
                  {joinMarketDialog.marketLabel || "Market"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.generalText, fontWeight: 600 }}
                >
                  {market.name}
                </Typography>
              </Box>
              <Box className="flex justify-between items-center">
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.grayStrong, fontWeight: 600 }}
                >
                  {joinMarketDialog.pointsCostLabel || "Points cost"}
                </Typography>
                <Box className="flex items-center gap-1">
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#F9A602",
                      fontWeight: 600,
                    }}
                  >
                    {pointsCost}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>

        <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
          <OutlineButton
            onClick={onClose}
            disabled={joinMarketMutation.isPending}
            className="flex-1 !min-w-[120px]"
          >
            {joinMarketDialog.cancel || "Cancel"}
          </OutlineButton>
          <MainButton
            onClick={handleJoin}
            disabled={joinMarketMutation.isPending}
            color={COLORS.primary}
            className="flex-1 !min-w-[120px]"
          >
            {joinMarketMutation.isPending
              ? joinMarketDialog.joining || "Joining..."
              : joinMarketDialog.joinButton || "Join market"}
          </MainButton>
        </Box>
      </Box>
    </MainDialog>
  );
};

export default JoinMarketDialog;
