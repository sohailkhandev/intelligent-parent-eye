import { Box, Typography } from "@mui/material";
import { MainDialog } from "@components";
import type { FusionResult } from "@types";
import { useLanguage } from "@providers";
import arrowIcon from "@assets/images/arrowIcon.png";
import { COLORS } from "@constants";

interface FusionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  fusionResult: FusionResult | null;
}

const SLOT_SIZE = 150;
const RESULT_SIZE = 280;

// Slight rotations for "photos on a table" look (2–4 slots)
const SLOT_ROTATIONS = [-8, 6, -5, 4];

export const FusionDetailDialog = ({
  open,
  onClose,
  fusionResult,
}: FusionDetailDialogProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const resultT = t?.result || {};
  const fusionDetail = resultT?.fusionDetail || {};

  if (!fusionResult) return null;

  const slotImages = fusionResult.slotsImages || [];
  const combinedImageUrl = fusionResult.imageUrl;

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={fusionDetail.title ?? "Fusion Details"}
      maxWidth="md"
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 3, sm: 2 },
          py: 3,
          px: 2,
          minHeight: 400,
        }}
      >
        {/* Arrow icon – centered between two columns, absolute */}
        {slotImages.length > 0 && (
          <Box
            component="img"
            src={arrowIcon}
            alt=""
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 90,
              height: 110,
              objectFit: "contain",
              pointerEvents: "none",
              display: { xs: "none", sm: "block" },
              zIndex: 1,
            }}
          />
        )}

        {/* Slot images – tilted, with shadow (left) */}
        {slotImages.length > 0 && (
          <Box
            sx={{
              position: "relative",
              width: SLOT_SIZE * 1.9,
              height: SLOT_SIZE * 1.55,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {slotImages.map((slot, index) => (
              <Box
                key={slot.slotId || index}
                component="img"
                src={slot.imageUrl}
                alt=""
                sx={{
                  position: "absolute",
                  width: SLOT_SIZE,
                  height: SLOT_SIZE,
                  borderRadius: "4px",
                  objectFit: "cover",
                  border: "2px solid #fff",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                  transform: `rotate(${SLOT_ROTATIONS[index % SLOT_ROTATIONS.length]}deg)`,
                  ...(index === 0 && { left: 0, bottom: -12 }),
                  ...(index === 1 && { right: 0, top: -40 }),
                  ...(index === 2 && { top: -40, left: 0 }),
                  ...(index === 3 && { bottom: 0, right: 0 }),
                }}
              />
            ))}
          </Box>
        )}

        {/* Result image – right, slight tilt, AI badge */}
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={combinedImageUrl}
            alt=""
            sx={{
              width: RESULT_SIZE,
              height: RESULT_SIZE,
              borderRadius: "4px",
              objectFit: "cover",
              border: "2px solid #fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
              transform: "rotate(2deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "40%",
              right: "-25px",
              width: 50,
              height: 50,
              transform: "rotate(15deg)",
              borderRadius: "50%",
              backgroundColor:
                fusionResult.score < 100 ? COLORS.secondary : COLORS.primary,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {fusionDetail.fusedBadge ?? "Fused"}
          </Box>
          <Typography
            sx={{
              mt: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              color: COLORS.generalText,
              textAlign: "center",
            }}
          >
            {resultT?.fusionTable?.score ?? "Score"}:{" "}
            <span
              className="font-bold"
              style={{
                color:
                  (fusionResult.score ?? 0) < 100
                    ? COLORS.secondary
                    : COLORS.primary,
              }}
            >
              {fusionResult.score ?? 0}
            </span>
          </Typography>
        </Box>
      </Box>
    </MainDialog>
  );
};
