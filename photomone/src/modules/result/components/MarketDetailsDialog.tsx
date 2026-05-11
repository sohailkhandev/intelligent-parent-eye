import { useState, useMemo, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { MainDialog, ThemeText } from "@components";
import type { ExposureResult } from "@types";
import { useAuthContext, useLanguage } from "@providers";
import { translateMarketName } from "@utils";
import { COLORS } from "@constants";
import { PointsIcon } from "@assets/icons/svg";

interface MarketDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  exposureResult: ExposureResult | null;
}

const YOU_GREEN = "#22C55E";
const SOLD_BLUE = "#29C4D6";
const IMAGE_BORDER_NEUTRAL = "#E0E0E0";

export const MarketDetailsDialog = ({
  open,
  onClose,
  exposureResult,
}: MarketDetailsDialogProps) => {
  const { authUser } = useAuthContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const marketDetails = resultTranslations?.marketDetails || {};
  const resultA11y = resultTranslations?.a11y || {};
  const translatedMarketName = translateMarketName(
    exposureResult?.marketName,
    translations
  );
  const [viewingPhotoIndex, setViewingPhotoIndex] = useState<number | null>(
    null
  );

  const users = exposureResult?.users || [];
  const viewingPhoto =
    viewingPhotoIndex !== null ? users[viewingPhotoIndex] : null;

  /** Current user's row in this exposure (if they participated). */
  const authUserInResult = useMemo(() => {
    if (!authUser?._id) return undefined;
    return users.find((user) => user._id === authUser._id);
  }, [authUser?._id, users]);

  /** Show outcome whenever the viewer is in this result; do not gate on exposureResult.isSold,
   *  otherwise "Sale failed" never appears when nothing sold overall but the user had exposure. */
  const showUserSaleOutcome = Boolean(authUserInResult);
  const userSaleSucceeded = authUserInResult?.isSold === true;

  const handleImageClick = (index: number) => {
    setViewingPhotoIndex(index);
  };

  const handleBackClick = () => {
    setViewingPhotoIndex(null);
  };

  useEffect(() => {
    if (!open) {
      setViewingPhotoIndex(null);
    }
  }, [open]);

  if (!exposureResult) return null;

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={marketDetails.title || "Transaction Details"}
      maxWidth="md"
    >
      <Box className="mt-6">
        {/* Market Name - dark bold uppercase, left-aligned */}
        <Typography
          className="!text-lg !font-proxima uppercase font-semibold mb-1"
          sx={{
            color: COLORS.generalText,
          }}
        >
          {translatedMarketName || exposureResult.marketName}
        </Typography>

        {/* Earned box - white bg, light red border, icon + label + value */}
        <Box
          className="mb-6 py-3 px-4 flex items-center rounded-xl justify-between"
          sx={{
            border: `1px solid ${COLORS.secondary}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{ boxShadow: `0 0 10px -5px #758599`, borderRadius: "50%" }}
            >
              <PointsIcon />
            </Box>
            <ThemeText
              text={marketDetails.earned || "Earned"}
              className="font-medium"
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: COLORS.primary,
              fontWeight: 700,
            }}
          >
            {exposureResult.purchasePoints ?? 0}
          </Typography>
        </Box>

        {/* Users Section - 4 images in a row */}
        {viewingPhotoIndex === null ? (
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(3, 1fr)",
                  sm: "repeat(4, 1fr)",
                },
                gap: 2,
                mb: 3,
              }}
            >
              {users.map((user, idx) => {
                const isCurrentUser = authUser?._id === user._id;
                const borderColor = isCurrentUser
                  ? YOU_GREEN
                  : user.isSold
                    ? SOLD_BLUE
                    : IMAGE_BORDER_NEUTRAL;
                return (
                  <Box
                    key={user._id || idx}
                    onClick={() => handleImageClick(idx)}
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: `2px solid ${borderColor}`,
                      "&:hover": { opacity: 0.95 },
                    }}
                  >
                    <Box
                      component="img"
                      src={user.imageUrl}
                      alt={user.fullName || `Photo ${idx + 1}`}
                      sx={{
                        width: "100%",
                        aspectRatio: "1",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {/* You tag - top-left, green */}
                    {isCurrentUser && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          px: 1,
                          py: 0.5,
                          backgroundColor: YOU_GREEN,
                          color: COLORS.white,
                          borderRadius: 1,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {marketDetails.you || "You"}
                      </Box>
                    )}
                    {/* Sold tag - top-left for others, top-right for current user (so both YOU and Sold show) */}
                    {user.isSold && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: isCurrentUser ? undefined : 8,
                          right: isCurrentUser ? 8 : undefined,
                          px: 1,
                          py: 0.5,
                          backgroundColor: SOLD_BLUE,
                          color: COLORS.white,
                          borderRadius: 1,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {marketDetails.sold || "Sold"}
                      </Box>
                    )}
                    {/* Info icon - bottom-right, white circle with i */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(idx);
                      }}
                      aria-label={
                        resultA11y.openPhotoDetails || "Open photo details"
                      }
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        width: 22,
                        height: 22,
                        minWidth: 22,
                        minHeight: 22,
                        borderRadius: "50%",
                        color: COLORS.primary,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>

            {showUserSaleOutcome && (
              <Typography
                variant="body2"
                sx={{
                  color: userSaleSucceeded ? COLORS.secondary : "#EF4444",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {userSaleSucceeded
                  ? marketDetails.saleSuccessful || "Sale Successful"
                  : marketDetails.saleFailed || "Sale Failed"}
              </Typography>
            )}
          </Box>
        ) : (
          /* Detail View */
          <Box>
            <Box sx={{ mb: 2 }}>
              <IconButton
                onClick={handleBackClick}
                aria-label={marketDetails.backAriaLabel || "Back"}
                sx={{
                  color: COLORS.generalText,
                  "&:hover": { backgroundColor: COLORS.grayLight },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            {viewingPhoto && (
              <Box
                sx={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: COLORS.white,
                }}
              >
                <Box sx={{ mb: 2, borderRadius: 1, overflow: "hidden" }}>
                  <Box
                    component="img"
                    src={viewingPhoto.imageUrl}
                    alt={
                      viewingPhoto.fullName ||
                      resultA11y.detailPhoto ||
                      "Photo"
                    }
                    sx={{
                      width: "100%",
                      maxHeight: 180,
                      objectFit: "contain",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#F3F3F3",
                    borderRadius: 1,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: COLORS.secondary,
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {marketDetails.photoOwner || "Photo Owner"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#758599", fontSize: "0.75rem" }}
                  >
                    {marketDetails.id || "ID"}: {viewingPhoto._id}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </MainDialog>
  );
};

export default MarketDetailsDialog;
