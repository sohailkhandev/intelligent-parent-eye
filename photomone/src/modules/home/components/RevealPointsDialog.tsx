import { Box, Typography } from "@mui/material";
import { MainDialog, MainButton, OutlineButton } from "@components";
import { SlotApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { COLORS } from "@constants";
import { translateSlotApiError } from "@utils";

interface RevealPointsDialogProps {
  open: boolean;
  onClose: () => void;
  slotId: string | null;
  /** Called after successful reveal (e.g. schedule showing claim dialog after delay) */
  onRevealSuccess?: () => void;
  title?: string;
  message?: string;
  /** Small text at bottom (e.g. "Use 1 Locky") */
  lockySubtext?: string;
  cancelLabel?: string;
  revealLabel?: string;
}

const DEFAULT_TITLE = "Reveal Points";
const DEFAULT_MESSAGE = "Are you sure?";
const DEFAULT_LOCKY_SUBTEXT = "Use 1 Locky";
const DEFAULT_CANCEL = "Cancel";
const DEFAULT_REVEAL = "Reveal";

const REVEAL_SUCCESS_DELAY_MS = 2000;

export const RevealPointsDialog = ({
  open,
  onClose,
  slotId,
  onRevealSuccess,
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
  lockySubtext = DEFAULT_LOCKY_SUBTEXT,
  cancelLabel = DEFAULT_CANCEL,
  revealLabel = DEFAULT_REVEAL,
}: RevealPointsDialogProps) => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const slotErrors = translations?.slotDetail?.errors;
  const revealPointsMutation = SlotApis.useRevealPoints();
  const isLoading = revealPointsMutation.isPending;

  const handleReveal = () => {
    if (!slotId) return;
    revealPointsMutation.mutate(slotId, {
      onSuccess: () => {
        onClose();
        if (onRevealSuccess) {
          setTimeout(() => onRevealSuccess(), REVEAL_SUCCESS_DELAY_MS);
        }
      },
      onError: (err: Error) =>
        showToast(
          translateSlotApiError(err.message, slotErrors, "reveal"),
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
          <Typography
            sx={{
              color: COLORS.generalText,
              textAlign: "center",
              fontSize: "0.875rem",
              lineHeight: 1.4,
              opacity: 0.85,
            }}
          >
            {lockySubtext}
          </Typography>
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
              onClick={handleReveal}
              disabled={isLoading || !slotId}
              className="!min-w-[140px] !px-6"
            >
              {revealLabel}
            </MainButton>
          </Box>
        </Box>
      </Box>
    </MainDialog>
  );
};

export default RevealPointsDialog;
