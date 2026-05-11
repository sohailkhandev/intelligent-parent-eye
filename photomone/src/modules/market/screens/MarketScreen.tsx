import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Dialog, DialogContent } from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { DashboardHeading, ThemeText, MainButton } from "@components";
import { WaitingCard, PurchaseLicenseDialog } from "../components";
import type { MainMarket } from "@types";
import { useLanguage, useAuthContext } from "@providers";
import { COLORS, ROUTES } from "@constants";
import { translateMarketName, playSuccessChime } from "@utils";

/** Private-use chars so translated templates can place styled highlight vs market name in any order. */
const PC_GRATS_HIGHLIGHT = "\uE000";
const PC_GRATS_MARKET = "\uE001";

function renderPurchaseCongratsBody(
  template: string,
  highlight: string,
  marketDisplay: string
): ReactNode {
  const marked = template
    .replace(/\{\{highlight\}\}/g, PC_GRATS_HIGHLIGHT)
    .replace(/\{\{market\}\}/g, PC_GRATS_MARKET);
  const parts = marked.split(
    new RegExp(`(${PC_GRATS_HIGHLIGHT}|${PC_GRATS_MARKET})`)
  );
  return parts.map((part, i) => {
    if (part === PC_GRATS_HIGHLIGHT) {
      return (
        <Box
          component="span"
          key={`grats-h-${i}`}
          sx={{ color: COLORS.primary, fontWeight: 700 }}
        >
          {highlight}
        </Box>
      );
    }
    if (part === PC_GRATS_MARKET) {
      return (
        <Box
          component="span"
          key={`grats-m-${i}`}
          sx={{ color: COLORS.generalText, fontWeight: 600 }}
        >
          {marketDisplay}
        </Box>
      );
    }
    return <span key={`grats-t-${i}`}>{part}</span>;
  });
}

interface MarketScreenProps {
  marketName?: string;
  // category?: string | null;
  market?: MainMarket | null;
}

export const MarketScreen = ({
  marketName = "Market 1",
  // category = null,
  market,
}: MarketScreenProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const marketTranslations = t?.market || {};
  const screen = marketTranslations?.screen || {};
  const purchaseCongrats = marketTranslations?.purchaseCongrats || {};
  const translatedMarketName = translateMarketName(marketName, translations);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [congratsData, setCongratsData] = useState<{
    exposureAmount: number;
    marketName: string;
  } | null>(null);

  const navigate = useNavigate();
  const { refreshUser } = useAuthContext();

  const handlePurchaseSuccess = useCallback(
    (data: { exposureAmount: number; marketName: string }) => {
      setCongratsData(data);
      setCongratsOpen(true);
      setPurchaseDialogOpen(false);
    },
    []
  );

  const handleCongratsOk = () => {
    setCongratsOpen(false);
    setCongratsData(null);
    navigate(`/dashboard/${ROUTES.result}`);
    refreshUser();
  };

  // Play success sound when congrats dialog opens (exposure earning)
  useEffect(() => {
    if (!congratsOpen) return;
    return playSuccessChime();
  }, [congratsOpen]);

  // Reset state when market data changes or component unmounts
  useEffect(() => {
    return () => {
      setSelectedImage(null);
      setSelectedSlotId(null);
      setPurchaseDialogOpen(false);
      setIsPurchasing(false);
    };
  }, []);

  // Reset state when market changes
  useEffect(() => {
    setSelectedImage(null);
    setSelectedSlotId(null);
    setPurchaseDialogOpen(false);
    setIsPurchasing(false);
    setCongratsOpen(false);
    setCongratsData(null);
  }, [market?._id]);

  // Dynamic list: 2–12 sellers from API
  const sellerDetails = market?.otherSellerDetails || [];
  const slots = sellerDetails.map((d) => d?.imageUrl || null);

  // Column count for grid: 12,11→6 | 10,9→5 | 8,7→4 | 6,5→3 | 4,3,2,1→2
  const colsLg =
    slots.length >= 11
      ? 6
      : slots.length >= 9
        ? 5
        : slots.length >= 7
          ? 4
          : slots.length >= 5
            ? 3
            : 2;
  const maxWidthLg =
    slots.length >= 11
      ? "none"
      : slots.length >= 9
        ? "none"
        : slots.length >= 7
          ? "940px"
          : slots.length >= 5
            ? "700px"
            : "460px";

  const getSlotIdForIndex = (index: number) => {
    const detail = sellerDetails[index];
    if (!detail) return null;
    const imageId = detail.imageId;
    if (typeof imageId === "string") return imageId;
    if (imageId && typeof imageId === "object" && "_id" in imageId)
      return imageId._id;
    return detail.slotId || null;
  };

  const handlePhotoClick = (imageUrl: string | null, index: number) => {
    if (!imageUrl) return;
    const slotId = getSlotIdForIndex(index);
    setSelectedImage(imageUrl);
    setSelectedSlotId(slotId);
    setPurchaseDialogOpen(true);
  };

  const handleClosePurchaseDialog = () => {
    setPurchaseDialogOpen(false);
    setIsPurchasing(false);
  };

  return (
    <Box className="pb-4">
      {/* Header with Market Name and Category Badge */}
      <Box className="mb-4">
        <DashboardHeading title={translatedMarketName} className="mb-0" />
        {/* {category && (
          <Box className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D9DFD]/20 border border-[#0D9DFD]/30">
            <svg
              className="w-4 h-4 text-[#0D9DFD]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <Typography className="text-sm font-inter font-medium text-[#0D9DFD]">
              {category}
            </Typography>
          </Box>
        )} */}
      </Box>

      {/* Responsive layout: 3 cols mobile, 4 cols desktop, centered */}
      <Box className="w-full px-4 mx-auto">
        <Box className="mb-4 flex justify-center">
          <ThemeText text={screen.pickAPhoto ?? "Pick a photo you like."} />
        </Box>
        {/* <Box
          className={`grid grid-cols-3 gap-3 max-h-[calc(100vh-230px)] overflow-y-auto lg:gap-4 ${slotsLengthTest >= 12 ? "lg:grid-cols-6" : slotsLengthTest >= 10 ? "grid-cols-5" : ""}`}
        >
          {slots.map((imageUrl, index) => (
            <Box
              key={`slot-${index}`}
              className={`relative transition-all duration-300 aspect-square rounded-lg lg:rounded-xl overflow-hidden ${
                imageUrl ? "cursor-pointer hover:opacity-80" : ""
              }`}
              onClick={() => imageUrl && handlePhotoClick(imageUrl, index)}
            >
              {imageUrl ? (
                <>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={`Slot ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg lg:rounded-xl"
                  />
                  {selectedSlotId === getSlotIdForIndex(index) &&
                    isPurchasing && (
                      <Box className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg lg:rounded-xl">
                        <Typography className="text-white text-xs font-medium font-proxima">
                          {screen.purchasing ?? "Purchasing..."}
                        </Typography>
                      </Box>
                    )}
                </>
              ) : (
                <WaitingCard
                  className="w-full h-full rounded-lg lg:rounded-xl"
                  text={screen.waitingEllipsis || "Waiting..."}
                  size="default"
                />
              )}
            </Box>
          ))}
        </Box> */}

        <Box
          className="max-h-[calc(100vh-230px)] overflow-y-auto mx-auto"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: "12px", lg: "16px" },
            maxWidth: { xs: "100%", lg: maxWidthLg },
          }}
        >
          {slots.map((imageUrl, index) => (
            <Box
              key={`slot-${index}`}
              className={`relative transition-all duration-300 aspect-square rounded-lg lg:rounded-xl overflow-hidden flex-shrink-0 ${
                imageUrl ? "cursor-pointer hover:opacity-80" : ""
              }`}
              sx={{
                border: `1px solid ${COLORS.border}`,
                width: {
                  xs: "calc((100% - 2 * 12px) / 3)",
                  lg: `calc((100% - ${colsLg - 1} * 16px) / ${colsLg})`,
                },
              }}
              onClick={() => imageUrl && handlePhotoClick(imageUrl, index)}
            >
              {imageUrl ? (
                <>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={`Slot ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg lg:rounded-xl"
                  />
                  {selectedSlotId === getSlotIdForIndex(index) &&
                    isPurchasing && (
                      <Box className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg lg:rounded-xl">
                        <Typography className="text-white text-xs font-medium font-proxima">
                          {screen.purchasing ?? "Purchasing..."}
                        </Typography>
                      </Box>
                    )}
                </>
              ) : (
                <WaitingCard
                  className="w-full h-full rounded-lg lg:rounded-xl"
                  text={screen.waitingEllipsis || "Waiting..."}
                  size="default"
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Purchase License Dialog */}
      {market && (
        <PurchaseLicenseDialog
          open={purchaseDialogOpen}
          onClose={handleClosePurchaseDialog}
          purchasePoints={market.purchasePoints}
          selectedPhotoUrl={selectedImage}
          slotId={selectedSlotId}
          marketName={marketName}
          onPurchaseStateChange={setIsPurchasing}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}

      {/* Congratulations dialog - rendered here so it stays visible after purchase dialog closes */}
      <Dialog
        open={congratsOpen}
        disableEscapeKeyDown
        onClose={() => {}}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "visible",
            maxWidth: 400,
            boxShadow: congratsOpen
              ? `0 24px 56px rgba(0,0,0,0.2), 0 0 0 1px ${COLORS.primary}20`
              : "none",
            border: `1px solid ${COLORS.border}`,
            animation: congratsOpen
              ? "congratsPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
              : "none",
            opacity: 0,
            "@keyframes congratsPop": {
              "0%": { opacity: 0, transform: "scale(0.7) translateY(20px)" },
              "60%": { opacity: 1, transform: "scale(1.05) translateY(-4px)" },
              "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
            },
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0,0,0,0.5)",
              animation: congratsOpen
                ? "backdropFade 0.3s ease-out forwards"
                : "none",
              "@keyframes backdropFade": {
                "0%": { opacity: 0 },
                "100%": { opacity: 1 },
              },
            },
            onClick: (e) => e.stopPropagation(),
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            "&.MuiDialogContent-root": { padding: 0 },
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              pt: 3,
              pb: 2,
              px: 3,
              textAlign: "center",
              background: `linear-gradient(180deg, ${COLORS.primary}12 0%, ${COLORS.primary}06 100%)`,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: `${COLORS.primary}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                animation: congratsOpen
                  ? "iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both"
                  : "none",
                boxShadow: `0 0 0 0 ${COLORS.primary}40`,
                "@keyframes iconBounce": {
                  "0%": {
                    opacity: 0,
                    transform: "scale(0)",
                    boxShadow: `0 0 0 0 ${COLORS.primary}40`,
                  },
                  "50%": {
                    opacity: 1,
                    transform: "scale(1.2)",
                    boxShadow: `0 0 24px 8px ${COLORS.primary}30`,
                  },
                  "100%": {
                    opacity: 1,
                    transform: "scale(1)",
                    boxShadow: `0 0 16px 4px ${COLORS.primary}25`,
                  },
                },
              }}
            >
              <CelebrationIcon sx={{ fontSize: 36, color: COLORS.primary }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: COLORS.generalText,
                lineHeight: 1.4,
                mb: 0.5,
                animation: congratsOpen
                  ? "textFadeIn 0.4s ease-out 0.35s both"
                  : "none",
                "@keyframes textFadeIn": {
                  "0%": { opacity: 0, transform: "translateY(8px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {purchaseCongrats.title || "Congratulations!"}
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: COLORS.grayStrong,
                lineHeight: 1.5,
                animation: congratsOpen
                  ? "textFadeIn 0.4s ease-out 0.5s both"
                  : "none",
                "@keyframes textFadeIn": {
                  "0%": { opacity: 0, transform: "translateY(8px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {(() => {
                const count = congratsData?.exposureAmount ?? 0;
                const marketDisplay = congratsData?.marketName ?? "Market";
                const highlightOne =
                  purchaseCongrats.highlightOne || "1 exposure";
                const highlightManyTpl =
                  purchaseCongrats.highlightMany || "{count} exposures";
                const highlight =
                  count === 1
                    ? highlightOne
                    : highlightManyTpl.replace(
                        /\{count\}/g,
                        String(count)
                      );
                const template =
                  purchaseCongrats.messageTemplate ||
                  "You have received {{highlight}} in {{market}}";
                return renderPurchaseCongratsBody(
                  template,
                  highlight,
                  marketDisplay
                );
              })()}
            </Typography>
          </Box>
          <Box sx={{ p: 2.5, display: "flex", justifyContent: "center" }}>
            <MainButton
              onClick={handleCongratsOk}
              color={COLORS.primary}
              className="!min-w-[140px] !rounded-full"
            >
              {purchaseCongrats.ok || "OK"}
            </MainButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MarketScreen;
