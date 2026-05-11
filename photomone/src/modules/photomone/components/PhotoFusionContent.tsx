import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DashboardSubHeading, Loading, MainButton } from "@components";
import { FusedSlotCard } from "./FusedSlotCard";
import { FusionSuccessPopup } from "./FusionSuccessPopup";
import type { FusedSlot } from "@types";
import { SlotApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { COLORS } from "@constants";
import {
  prepareSuccessChime,
  playFusionSuccessChime,
  translateFusionFuseError,
} from "@utils";

interface PhotoFusionContentProps {
  slots: FusedSlot[];
  filledSlotsCount?: number;
  isLoading?: boolean;
  onSlotAdd?: (slot: FusedSlot) => void;
}

export const PhotoFusionContent = ({
  slots,
  filledSlotsCount = 0,
  isLoading = false,
  onSlotAdd,
}: PhotoFusionContentProps) => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const photomone = t?.photomone || {};
  const photoFusion = photomone?.photoFusion || {};
  const selfFuseMutation = SlotApis.useSelfFuse();
  const fuseLabel = photoFusion.fuseButton ?? "Fuse";
  const [showFusionSuccessPopup, setShowFusionSuccessPopup] = useState(false);
  const [fusionResult, setFusionResult] = useState<{
    imageUrl: string;
    score: number;
    fusionNumber: number;
  } | null>(null);

  const canFuse = filledSlotsCount >= 2;

  const handleFuseClick = () => {
    const filledSlots = slots.filter(
      (slot): slot is FusedSlot & { slotId: string } =>
        slot.imageUrl != null && slot.slotId != null
    );
    const slotIds = filledSlots.map((s) => s.slotId);
    if (slotIds.length < 2) return;

    prepareSuccessChime();

    selfFuseMutation.mutate(
      { slotIds },
      {
        onSuccess: (res: {
          data?: { slot?: { imageUrl?: string; score?: number; fusionNumber?: number } };
        }) => {
          const slot = res?.data?.slot;
          if (slot?.imageUrl != null) {
            setFusionResult({
              imageUrl: slot.imageUrl,
              score: typeof slot.score === "number" ? slot.score : 0,
              fusionNumber:
                typeof slot.fusionNumber === "number" ? slot.fusionNumber : 0,
            });
          }
          playFusionSuccessChime();
          setShowFusionSuccessPopup(true);
        },
        onError: (error: {
          response?: { data?: { message?: string } };
          message?: string;
        }) => {
          const raw =
            error?.response?.data?.message ||
            error?.message ||
            (photoFusion.fuseFailed ?? "Fusion failed. Please try again.");
          showToast(translateFusionFuseError(String(raw), photoFusion), "error");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-12">
        <Loading size={48} />
      </Box>
    );
  }

  if (selfFuseMutation.isPending) {
    return (
      <Box
        className="flex flex-col items-center justify-center py-16 px-4"
        sx={{
          minHeight: 320,
          background: `linear-gradient(135deg, ${COLORS.primary}08 0%, ${COLORS.secondary}12 100%)`,
          borderRadius: 3,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Loading size={56} />
        <Typography
          className="mt-6 font-proxima font-semibold"
          sx={{ color: COLORS.generalText, fontSize: "1.1rem" }}
        >
          {photoFusion.fusionInProgress ?? "Fusion in progress..."}
        </Typography>
        <Typography
          className="mt-2 font-proxima"
          sx={{ color: "#758599", fontSize: "0.9rem" }}
        >
          {photoFusion.fusionWait ?? "Combining your photos. Please wait."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <FusionSuccessPopup
        open={showFusionSuccessPopup}
        onClose={() => {
          setShowFusionSuccessPopup(false);
          setFusionResult(null);
        }}
        visitGalleryText={photoFusion.visitGallery ?? "Visit gallery"}
        imageUrl={fusionResult?.imageUrl}
        score={fusionResult?.score}
        fusionNumber={fusionResult?.fusionNumber}
      />
      <Box className="lg:space-y-6 space-y-4 max-h-[calc(100vh-225px)] lg:max-h-[calc(100vh-290px)] overflow-y-auto">
        <DashboardSubHeading
          title={
            photoFusion.selectFromGalleryHeading ??
            "Select a photo from your gallery"
          }
          className="mb-4"
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {slots.map((slot) => (
            <FusedSlotCard key={slot._id} slot={slot} onAddClick={onSlotAdd} />
          ))}
        </Box>

        <Box className="flex justify-center lg:pt-4">
          <MainButton
            disabled={!canFuse}
            onClick={handleFuseClick}
            className="min-w-[200px] !rounded-full"
          >
            {fuseLabel}
          </MainButton>
        </Box>
      </Box>
    </>
  );
};

export default PhotoFusionContent;
