import { Box, Typography } from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { MainDialog, MainButton, OutlineButton } from "@components";
import { SlotApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { COLORS } from "@constants";
import { translateSlotApiError } from "@utils";

const POINTS_ANIMATION_DURATION_MS = 800;
const POINTS_ANIMATION_FPS = 60;

interface ClaimPointsWarningDialogProps {
  open: boolean;
  onClose: () => void;
  slotId: string | null;
  /** Points that will be claimed (shown in the dialog) */
  pointsToClaim?: number | null;
  title?: string;
  message?: string;
  pointsLabel?: string;
  cancelLabel?: string;
  claimLabel?: string;
}

const DEFAULT_TITLE = "Claim Points";
const DEFAULT_MESSAGE =
  "Claiming permanently deactivates this slot. Continue?";
const DEFAULT_POINTS_LABEL = "Points to be claimed";
const DEFAULT_CANCEL = "Cancel";
const DEFAULT_CLAIM = "Claim";

export const ClaimPointsWarningDialog = ({
  open,
  onClose,
  slotId,
  pointsToClaim,
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
  pointsLabel = DEFAULT_POINTS_LABEL,
  cancelLabel = DEFAULT_CANCEL,
  claimLabel = DEFAULT_CLAIM,
}: ClaimPointsWarningDialogProps) => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const slotErrors = translations?.slotDetail?.errors;
  const claimPointsMutation = SlotApis.useClaimPoints();
  const isLoading = claimPointsMutation.isPending;
  const [displayedPoints, setDisplayedPoints] = useState(0);

  // Animate points count-up when dialog opens with pointsToClaim
  useEffect(() => {
    if (!open || pointsToClaim == null) {
      setDisplayedPoints(0);
      return;
    }
    const target = pointsToClaim;
    setDisplayedPoints(0);
    const step = Math.max(
      1,
      Math.ceil(
        target / (POINTS_ANIMATION_DURATION_MS / (1000 / POINTS_ANIMATION_FPS))
      )
    );
    const intervalMs = 1000 / POINTS_ANIMATION_FPS;
    const timer = setInterval(() => {
      setDisplayedPoints((prev) => {
        const next = Math.min(prev + step, target);
        if (next >= target) return target;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [open, pointsToClaim]);

  // Snap to final value when animation would be done
  useEffect(() => {
    if (!open || pointsToClaim == null) return;
    const timeout = setTimeout(
      () => setDisplayedPoints(pointsToClaim),
      POINTS_ANIMATION_DURATION_MS + 50
    );
    return () => clearTimeout(timeout);
  }, [open, pointsToClaim]);

  const handleClaim = () => {
    if (!slotId) return;
    claimPointsMutation.mutate(slotId, {
      onSuccess: () => onClose(),
      onError: (err: Error) =>
        showToast(
          translateSlotApiError(err.message, slotErrors, "claim"),
          "error"
        ),
    });
  };

  return (
    <MainDialog open={open} onClose={onClose} title={title} maxWidth="sm">
      <Box sx={{ pt: 4, px: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              p: 1.5,
              backgroundColor: `${COLORS.secondary}15`,
              color: COLORS.secondary,
            }}
          >
            <WarningAmber sx={{ fontSize: 48 }} />
          </Box>
          <Typography
            sx={{
              color: COLORS.generalText,
              fontWeight: 600,
              textAlign: "center",
              fontSize: "1.25rem",
              lineHeight: 1.4,
            }}
          >
            {message}
          </Typography>
          {pointsToClaim != null && (
            <Box
              sx={{
                width: "100%",
                py: 1.5,
                px: 2,
                borderRadius: "12px",
                border: `1px solid ${COLORS.secondary}`,
                backgroundColor: COLORS.white,
              }}
            >
              <Typography
                sx={{
                  color: COLORS.generalText,
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                {pointsLabel}
              </Typography>
              <Typography
                sx={{
                  color: COLORS.primary,
                  fontWeight: 700,
                  fontSize: "2rem",
                  textAlign: "center",
                  lineHeight: 1.2,
                  animation: "pointsPopIn 0.5s ease-out",
                  "@keyframes pointsPopIn": {
                    "0%": { transform: "scale(0.6)", opacity: 0 },
                    "60%": { transform: "scale(1.05)", opacity: 1 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              >
                {displayedPoints.toLocaleString()}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              justifyContent: "center",
              mt: 0.5,
            }}
          >
            <OutlineButton
              onClick={onClose}
              disabled={isLoading}
              className="!min-w-[140px] !px-6"
            >
              {cancelLabel}
            </OutlineButton>
            <MainButton
              onClick={handleClaim}
              disabled={isLoading || !slotId}
              className="!min-w-[140px] !px-6"
            >
              {claimLabel}
            </MainButton>
          </Box>
        </Box>
      </Box>
    </MainDialog>
  );
};

export default ClaimPointsWarningDialog;
