import { useState, useMemo, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { MainDialog } from "@components";
import type { ExposureBatchEndedPayload } from "@types";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { translateMarketName } from "@utils";
import { COLORS } from "@constants";

interface SellingReportDialogProps {
  open: boolean;
  onClose: () => void;
  payload: ExposureBatchEndedPayload | null;
}

const YOU_GREEN = "#22C55E";
const SOLD_BLUE = "#29C4D6";
const IMAGE_BORDER_NEUTRAL = "#E0E0E0";

export const SellingReportDialog = ({
  open,
  onClose,
  payload,
}: SellingReportDialogProps) => {
  const { authUser } = useAuthContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const marketDetails = resultTranslations?.marketDetails || {};
  const sellingReport = resultTranslations?.sellingReport || {};
  const a11y = resultTranslations?.a11y || {};
  const [activeTab, setActiveTab] = useState(0);
  const [tabPage, setTabPage] = useState(0);
  const TABS_PER_PAGE = 6;
  const translatedMarketName = translateMarketName(
    payload?.marketName,
    translations
  );
  const [viewingPhotoIndex, setViewingPhotoIndex] = useState<number | null>(
    null
  );

  const tabs = payload?.exposureResults || [];
  const totalTabPages =
    tabs.length > 0 ? Math.ceil(tabs.length / TABS_PER_PAGE) : 1;
  const visibleStart = tabPage * TABS_PER_PAGE;
  const visibleTabs = tabs.slice(visibleStart, visibleStart + TABS_PER_PAGE);
  const exposuresCount =
    payload?.exposure ??
    payload?.exposures ??
    payload?.exposureResults?.length ??
    0;
  const salesCount =
    payload?.photoLicensesSold ?? payload?.photoLicenseSold ?? 0;
  const totalPoints = payload?.totalPoints ?? 0;
  const scoreEarned = payload?.totalScoreEarned ?? 0;
  const currentTabData = tabs[activeTab];
  const users = currentTabData?.usersData || [];
  const viewingPhoto =
    viewingPhotoIndex !== null ? users[viewingPhotoIndex] : null;

  const isAuthUserSale = useMemo(() => {
    if (!authUser?._id) return false;
    const authUserInResult = users.find(
      (user) => user.userId === authUser._id || user._id === authUser._id
    );
    return authUserInResult?.isSold === true;
  }, [authUser?._id, users]);

  const handleImageClick = (index: number) => {
    setViewingPhotoIndex(index);
  };

  const handleBackClick = () => {
    setViewingPhotoIndex(null);
  };

  useEffect(() => {
    if (!open) {
      setViewingPhotoIndex(null);
      setActiveTab(0);
      setTabPage(0);
    }
  }, [open]);

  useEffect(() => {
    setViewingPhotoIndex(null);
  }, [activeTab]);

  if (!payload) return null;

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={marketDetails.title || "Transaction Details"}
      maxWidth="md"
    >
      <Box className="mt-4">
        {/* <Typography
          className="!text-lg !font-proxima uppercase font-semibold mb-1"
          sx={{
            color: COLORS.generalText,
          }}
        >
          {translatedMarketName || payload.marketName}
        </Typography> */}

        <Box
          sx={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            backgroundColor: COLORS.white,
            p: 1.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(5, 1fr)",
              },
              gap: 1,
            }}
          >
            <Box>
              <Typography
                sx={{ color: COLORS.grayStrong, fontSize: "0.72rem" }}
              >
                {sellingReport.market || "Market"}
              </Typography>
              <Typography
                sx={{
                  color: COLORS.generalText,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {translatedMarketName || payload.marketName || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ color: COLORS.grayStrong, fontSize: "0.72rem" }}
              >
                {sellingReport.pointsEarned || "Points earned"}
              </Typography>
              <Typography
                sx={{
                  color: COLORS.primary,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {totalPoints}
              </Typography>
            </Box>
            {exposuresCount > 6 && (
              <Box>
                <Typography
                  sx={{ color: COLORS.grayStrong, fontSize: "0.72rem" }}
                >
                  {sellingReport.exposures || "Exposures"}
                </Typography>
                <Typography
                  sx={{
                    color: COLORS.generalText,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {exposuresCount}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography
                sx={{ color: COLORS.grayStrong, fontSize: "0.72rem" }}
              >
                {sellingReport.numberOfSales || "No. of sales"}
              </Typography>
              <Typography
                sx={{
                  color: COLORS.generalText,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {salesCount}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ color: COLORS.grayStrong, fontSize: "0.72rem" }}
              >
                {sellingReport.score || "Score"}
              </Typography>
              <Typography
                sx={{
                  color: COLORS.generalText,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {scoreEarned}
              </Typography>
            </Box>
          </Box>
        </Box>

        {tabs.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 2,
              justifyContent: "center",
              flexWrap: "nowrap",
              maxWidth: "80%",
              mx: "auto",
            }}
          >
            {visibleTabs.map((_, localIdx) => {
              const idx = visibleStart + localIdx;
              const selected = idx === activeTab;
              return (
                <Box
                  key={`selling-report-tab-${idx}`}
                  component="button"
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  sx={{
                    flex: "0 0 auto",
                    minWidth: 34,
                    height: 34,
                    px: 1.25,
                    borderRadius: "10px",
                    border: `1px solid ${selected ? COLORS.primary : COLORS.border}`,
                    backgroundColor: selected ? COLORS.primary : COLORS.white,
                    color: selected ? COLORS.white : COLORS.generalText,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  {idx + 1}
                </Box>
              );
            })}
            {tabs.length > TABS_PER_PAGE && (
              <IconButton
                onClick={() => setTabPage((prev) => (prev + 1) % totalTabPages)}
                size="small"
                sx={{
                  flex: "0 0 auto",
                  width: 34,
                  height: 34,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "10px",
                  color: COLORS.generalText,
                }}
              >
                <MoreHorizIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Box>
        )}

        {viewingPhotoIndex === null ? (
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(3, 1fr)",
                  sm: "repeat(4, 1fr)",
                },
                gap: 1,
                mb: 3,
              }}
            >
              {users.map((user, idx) => {
                const isCurrentUser =
                  authUser?._id === user.userId || authUser?._id === user._id;
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
                      alt={
                        (a11y.photoGridItem || "Photo {index}").replace(
                          "{index}",
                          String(idx + 1)
                        )
                      }
                      sx={{
                        width: "100%",
                        aspectRatio: "1",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {isCurrentUser && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          px: 1,
                          py: 0.2,
                          backgroundColor: YOU_GREEN,
                          color: COLORS.white,
                          borderRadius: 1,
                          fontSize: "0.5em",
                          fontWeight: 400,
                        }}
                      >
                        {marketDetails.you || "You"}
                      </Box>
                    )}
                    {user.isSold && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          left: isCurrentUser ? undefined : 4,
                          right: isCurrentUser ? 4 : undefined,
                          px: 1,
                          py: 0.2,
                          backgroundColor: SOLD_BLUE,
                          color: COLORS.white,
                          borderRadius: 1,
                          fontSize: "0.5em",
                          fontWeight: 400,
                        }}
                      >
                        {marketDetails.sold || "Sold"}
                      </Box>
                    )}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(idx);
                      }}
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

            {users.length > 0 && (
              <Typography
                variant="body2"
                sx={{
                  color: isAuthUserSale ? COLORS.secondary : COLORS.primary,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {isAuthUserSale
                  ? marketDetails.saleSuccessful || "Sale Successful"
                  : marketDetails.saleFailed || "Sale Failed"}
              </Typography>
            )}
          </Box>
        ) : (
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
                    alt={a11y.detailPhoto || "Photo"}
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
                    {marketDetails.id || "ID"}:{" "}
                    {viewingPhoto.slotId ||
                      viewingPhoto._id ||
                      viewingPhoto.userId}
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

export const SellingReportDialogGlobal = () => {
  const { sellingReportDialog } = useAppContext();
  return (
    <SellingReportDialog
      open={sellingReportDialog.open}
      onClose={sellingReportDialog.hide}
      payload={sellingReportDialog.payload}
    />
  );
};

export default SellingReportDialog;
