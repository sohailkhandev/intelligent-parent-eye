import { Box, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import type { FusedSlot } from "@types";
import { COLORS } from "@constants";
import { Loading } from "@components";
import { SlotApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { getFusedSlotBadgeLabel } from "@utils";

interface FusedSlotCardProps {
  slot: FusedSlot;
  onAddClick?: (slot: FusedSlot) => void;
}

/** Badge color by slot index: Primary/Face DNA = pink, Secondary/Sponsor Boost = teal */
function getBadgeColor(slotNumber: number): string {
  return slotNumber === 1 || slotNumber === 3 ? "#FFF0F2" : "#D8FDFF";
}

export const FusedSlotCard = ({ slot, onAddClick }: FusedSlotCardProps) => {
  const isEmpty = !slot.imageUrl;
  const isDisabled = slot.isDisabled === true;
  const canAdd = isEmpty && !isDisabled;
  const badgeColor = getBadgeColor(slot.slotNumber);
  const showFilledHoverCross = !!slot.imageUrl && !isDisabled;
  const showFilledAsClickable = showFilledHoverCross;
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const photoFusion = translations?.photomone?.photoFusion ?? {};
  const badgeLabel = getFusedSlotBadgeLabel(
    slot.slotNumber,
    photoFusion,
    slot.name
  );

  const cancelUploadMutation = SlotApis.useCancelUploadImageToFusedSlot();
  const [mutatingSlotId, setMutatingSlotId] = useState<string | null>(null);
  const isCancellingThisSlot =
    mutatingSlotId === slot._id && cancelUploadMutation.isPending;

  return (
    <Box
      onClick={() => canAdd && onAddClick?.(slot)}
      sx={{
        position: "relative",
        aspectRatio: "1",
        borderRadius: 3,
        overflow: "hidden",
        cursor: canAdd || showFilledAsClickable ? "pointer" : "default",
        border: `1px solid ${isEmpty && !isDisabled ? "rgba(41, 196, 214, 0.4)" : COLORS.border}`,
        backgroundColor: isEmpty ? "transparent" : undefined,
        boxShadow: canAdd
          ? `0 0 0 1px transparent, 0 1px 3px rgba(0,0,0,0.06)`
          : "0 1px 3px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, border-color 0.2s",
        opacity: isDisabled && isEmpty ? 0.6 : 1,
        "&:hover .filled-cross": showFilledHoverCross
          ? {
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1)",
            }
          : {},
        "&:hover": canAdd
          ? {
              borderColor: COLORS.primary,
              boxShadow: `0 0 12px ${COLORS.primary}40`,
            }
          : {},
      }}
    >
      {/* Image or transparent empty area */}
      {slot.imageUrl ? (
        <Box
          component="img"
          src={slot.imageUrl}
          alt={badgeLabel}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        />
      )}

      {/* Badge - always visible (Primary, Secondary, Face DNA, Sponsor Boost) */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          backgroundColor: badgeColor,
        }}
      >
        <Typography
          sx={{
            color:
              slot.slotNumber === 1 || slot.slotNumber === 3
                ? COLORS.secondary
                : COLORS.primary,
            fontSize: "0.7rem",
            fontWeight: 600,
          }}
        >
          {badgeLabel}
        </Typography>
      </Box>

      {/* Add button - only show when empty and not disabled */}
      {canAdd && (
        <Box
          component="button"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddClick?.(slot);
          }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: `2px solid ${COLORS.primary}`,
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: COLORS.white,
              color: COLORS.primary,
            },
          }}
        >
          <AddIcon sx={{ fontSize: 26 }} />
        </Box>
      )}

      {/* Filled slot hover cross icon */}
      {showFilledHoverCross && (
        <Box
          className="filled-cross"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            if (!slot._id) return;
            if (cancelUploadMutation.isPending) return;
            setMutatingSlotId(slot._id);
            cancelUploadMutation.mutate(slot._id, {
              onSuccess: () => setMutatingSlotId(null),
              onError: () => {
                setMutatingSlotId(null);
                showToast(
                  photoFusion.cancelUploadFailed ??
                    "Failed to cancel upload. Please try again.",
                  "error"
                );
              },
            });
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            (e.currentTarget as HTMLDivElement).click();
          }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: isCancellingThisSlot
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.98)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: isCancellingThisSlot
              ? COLORS.white
              : "rgba(0,0,0,0.35)",
            color: isCancellingThisSlot ? COLORS.primary : COLORS.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isCancellingThisSlot ? 1 : 0,
            transition: "opacity 0.15s ease, transform 0.15s ease",
            pointerEvents: isCancellingThisSlot ? "none" : "auto",
          }}
        >
          {mutatingSlotId === slot._id && cancelUploadMutation.isPending ? (
            <Loading size={18} />
          ) : (
            <CloseIcon sx={{ fontSize: 22 }} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default FusedSlotCard;
