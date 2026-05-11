import { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { MainDialog, MainButton, OutlineButton, Loading } from "@components";
import { useAppContext, useAuthContext, useLanguage } from "@providers";
import { UserApis } from "@apis";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants";
import { COLORS } from "@constants";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export const DeleteAccountDialog = ({
  open,
  onClose,
}: DeleteAccountDialogProps) => {
  const { showToast } = useAppContext();
  const { logout, authUser, refreshUser } = useAuthContext();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [acknowledged, setAcknowledged] = useState(false);

  const t = translations || {};
  const profileTranslations = t?.profile || {};
  const da = profileTranslations?.deleteAccount || {};

  const deleteAccountMutation = UserApis.useDeleteAccount();

  const handleDelete = () => {
    if (!acknowledged) return;
    if (!authUser?._id) {
      showToast(da.userNotFound || "User ID not found", "error");
      return;
    }

    deleteAccountMutation.mutate(authUser._id, {
      onSuccess: async () => {
        showToast(
          da.successMessage || "Your account has been deleted successfully",
          "success"
        );
        refreshUser();
        localStorage.removeItem("token");
        try {
          await logout();
        } catch (error) {
          console.error("Logout failed:", error);
        }
        navigate(ROUTES.landing);
        onClose();
      },
      onError: (error: Error) => {
        showToast(
          error?.message || da.errorMessage || "Failed to delete account",
          "error"
        );
      },
    });
  };

  const handleClose = () => {
    setAcknowledged(false);
    onClose();
  };

  return (
    <MainDialog
      open={open}
      onClose={handleClose}
      title={da.title || "Delete Account"}
      maxWidth="lg"
    >
      <Box
        className="mt-4 rounded-2xl border px-4 sm:px-8 py-4 space-y-6"
        sx={{ borderColor: COLORS.border }}
      >
        <Box>
          <Box sx={{ mb: 2.25 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: COLORS.generalText,
                fontWeight: 700,
                mb: 1,
                fontSize: "0.98rem",
              }}
            >
              {da.remainingAssetsTitle || "Remaining Assets Summary"}
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2.75,
                listStyleType: "disc",
                "& li": { mb: 0.75, display: "list-item" },
              }}
            >
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.remainingAssetsPointsLabel || "Current balance points"}
              </Typography>
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.remainingAssetsImagesLabel ||
                  "Number of stored/generated images (thumbnails)"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2.25 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: COLORS.generalText,
                fontWeight: 700,
                mb: 1,
                fontSize: "0.98rem",
              }}
            >
              {da.irreversibleLossTitle || "Irreversible Loss Warning"}
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2.75,
                listStyleType: "disc",
                "& li": { mb: 0.75, display: "list-item" },
              }}
            >
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.irreversibleLoss1 ||
                  "All digital assets, including points, items, and stored content, will be permanently deleted upon account deletion."}
              </Typography>
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.irreversibleLoss2 ||
                  "This action is irreversible and cannot be undone."}
              </Typography>
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.irreversibleLoss3 ||
                  "Deleted data cannot be recovered under any circumstances."}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2.25 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: COLORS.generalText,
                fontWeight: 700,
                mb: 1,
                fontSize: "0.98rem",
              }}
            >
              {da.userContentNoticeTitle || "User-Generated Content Notice"}
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2.75,
                listStyleType: "disc",
                "& li": { mb: 0.75, display: "list-item" },
              }}
            >
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.userContentNotice1 ||
                  "Please download any images or content you wish to keep before proceeding."}
              </Typography>
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.userContentNotice2 ||
                  "All images and content associated with your account will be permanently removed after deletion."}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: COLORS.generalText,
                fontWeight: 700,
                mb: 1,
                fontSize: "0.98rem",
              }}
            >
              {da.finalConfirmationHeading || "Final Confirmation Message"}
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2.75,
                listStyleType: "disc",
                "& li": { mb: 0.75, display: "list-item" },
              }}
            >
              <Typography
                component="li"
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  display: "list-item",
                }}
              >
                {da.finalConfirmationBullet ||
                  da.finalConfirmationMessage ||
                  "By proceeding, you acknowledge and accept that all remaining assets will be permanently lost."}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="flex items-center">
          <FormControlLabel
            control={
              <Checkbox
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                sx={{
                  py: 0,
                  color: COLORS.grayStrong,
                  "&.Mui-checked": { color: COLORS.primary ?? "#0D9DFD" },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  color: COLORS.generalText,
                  fontSize: "0.9rem",
                }}
              >
                {da.finalConfirmationMessage ||
                  "By proceeding, you acknowledge and accept that all remaining assets will be permanently lost."}
              </Typography>
            }
            sx={{ alignItems: "flex-start", mr: 0 }}
          />
        </Box>
      </Box>

      <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-4">
        <OutlineButton onClick={handleClose} className="flex-1 !min-w-[120px]">
          {da.cancelButton || "Cancel"}
        </OutlineButton>
        <MainButton
          type="button"
          onClick={handleDelete}
          disabled={deleteAccountMutation.isPending || !acknowledged}
          color="#FF2A3B"
          className="flex-1 !min-w-[120px]"
        >
          {deleteAccountMutation.isPending ? (
            <Box className="flex items-center justify-center gap-2">
              <Loading size={16} />
              <span>{da.deleting || "Deleting..."}</span>
            </Box>
          ) : (
            da.deleteButton || "Delete Account"
          )}
        </MainButton>
      </Box>
    </MainDialog>
  );
};
