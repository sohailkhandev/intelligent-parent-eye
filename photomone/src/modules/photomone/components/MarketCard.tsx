import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { MainButton } from "@components";
import { MarketData } from "@types";
import { COLORS } from "@constants";
import { LockCircleIcon, PointsIcon } from "@assets/icons/svg";
import { useLanguage } from "@providers";

interface MarketCardProps {
  market: MarketData;
  showPlusIcon?: boolean;
  onTicketsClick?: () => void;
  onClick: () => void;
  onSellClick?: () => void;
}

export const MarketCard = ({
  market,
  showPlusIcon = false,
  onTicketsClick,
  onClick,
  onSellClick,
}: MarketCardProps) => {
  const { translations } = useLanguage();
  const photomone = translations?.photomone || {};
  const marketCard = photomone.marketCard || {};

  const isFree = market.entries === null;
  const isLocked = market.entries === 0;

  const handleCardClick = () => {
    if (isLocked && onTicketsClick) {
      onTicketsClick();
    }
  };

  return (
    <Box
      onClick={isLocked ? handleCardClick : undefined}
      role={isLocked ? "button" : undefined}
      sx={{
        backgroundColor: COLORS.white,
        borderRadius: 3,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: { xs: 1.5, sm: 2 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: { xs: 160, sm: 170 },
        transition: "box-shadow 0.2s, border-color 0.2s",
        ...(isLocked && { cursor: "pointer" }),
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderColor: COLORS.primary,
        },
      }}
    >
      {/* Top row: icon left, tag right */}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        {/* Status tag: Free | Lock + Points | Plus (entries > 0) */}
        {/* Market title - centered, bold dark grey */}
        <Box>
          <Typography
            sx={{
              color: COLORS.generalText,
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              textAlign: "left",
              mb: 1,
            }}
          >
            {market.name}
          </Typography>

          {/* Free: ∞ entries | Paid: X Points */}
          {isFree ? (
            <Box className="border inline-block border-[#0FD433] text-[#0FD433] text-xs px-4 rounded-full py-1 mb-3">
              {marketCard.free || "Free"}
            </Box>
          ) : (
            <Box className="flex items-center gap-1 mb-2">
              <Box
                sx={{
                  color: COLORS.secondary,
                  boxShadow: `0 0 10px -5px #758599`,
                  borderRadius: "50%",
                }}
              >
                <PointsIcon width={20} height={20} />
              </Box>
              <Typography
                sx={{
                  color: "#F9A602",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {market.entryCost ?? market.purchasePoints ?? 0}{" "}
                {marketCard.points || "Points"}
              </Typography>
            </Box>
          )}
        </Box>
        {isFree ? (
          <Box
            sx={{
              px: 1.5,

              borderRadius: 20,
              backgroundColor: "#CEFCFF",
              color: "#29C4D6",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <span className="text-xl mt-0.5">∞</span>{" "}
            {marketCard.entries || "entries"}
          </Box>
        ) : isLocked ? (
          <Box className="flex flex-col items-center justify-center gap-3">
            <LockCircleIcon />
            <Box
              sx={{
                px: 1.5,
                py: 0.3,
                borderRadius: 20,
                backgroundColor: "#FFF0F2",
                color: "#F9929B",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {market.entries}{" "}
              {market.entries !== 1
                ? marketCard.entries || "entries"
                : marketCard.entry || "entry"}
            </Box>
          </Box>
        ) : showPlusIcon ? (
          <Box className="flex flex-col items-center justify-center gap-3">
            <Box
              component="button"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTicketsClick?.();
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `2px solid ${COLORS.primary}`,
                backgroundColor: COLORS.white,
                color: COLORS.primary,
                cursor: "pointer",
                "&:hover": { backgroundColor: `${COLORS.primary}15` },
              }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.3,
                borderRadius: 20,
                backgroundColor: "#FFF0F2",
                color: "#F9929B",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {market.entries}{" "}
              {market.entries !== 1
                ? marketCard.entries || "entries"
                : marketCard.entry || "entry"}
            </Box>
          </Box>
        ) : null}
      </Box>

      {/* Spacer to push button to bottom */}
      <Box sx={{ flex: 1 }} />

      {/* Purchase & Sell buttons — when locked, clicks pass through to card */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <Box className="flex-1" sx={{ ...(isLocked && { pointerEvents: "none" }) }}>
          <MainButton
            onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
              e?.stopPropagation();
              if (!isLocked) onClick();
            }}
            disabled={isLocked}
            color={COLORS.primary}
            className="w-full"
          >
            {marketCard.purchase || "Purchase"}
          </MainButton>
        </Box>
        <Box className="flex-1">
          {market.exposure != null && market.exposure > 0 && (
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: COLORS.grayStrong,
                fontWeight: 500,
                textAlign: "center",
                mb: 1,
                width: "100%",
                flex: 1,
              }}
            >
              {market.exposure}{" "}
              {market.exposure !== 1
                ? marketCard.exposures || "exposures"
                : marketCard.exposure || "exposure"}
            </Typography>
          )}
          <Button
            variant="outlined"
            disabled={
              market.exposure == null ||
              market.exposure === 0 ||
              market.inMarket
            }
            onClick={(e) => {
              e.stopPropagation();
              onSellClick?.();
            }}
            className="text-normal font-normal font-proxima py-2 !px-4 !rounded-full w-full"
            sx={{
              borderColor: COLORS.secondary,
              color: COLORS.secondary,
              "&:hover:not(.Mui-disabled)": {
                borderColor: COLORS.secondary,
                backgroundColor: `${COLORS.secondary}15`,
              },
              "&.Mui-disabled": {
                borderColor: "#E0E0E0",
                color: "#9E9E9E",
              },
            }}
          >
            {marketCard.sell || "Sell"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MarketCard;
