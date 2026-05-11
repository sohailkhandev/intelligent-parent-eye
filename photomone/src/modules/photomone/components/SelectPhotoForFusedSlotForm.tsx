import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { MainButton, OutlineButton, ThemeText } from "@components";
import type { Slot } from "@types";
import { SlotApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { COLORS } from "@constants";
import { translateAssignFusedPhotoError } from "@utils";

interface SelectPhotoForFusedSlotFormProps {
  /** ID of the fused slot we're assigning the image to (path param) */
  primaryFusedSlotId: string;
  slots: Slot[];
  /** Localized fused-slot label (e.g. Primary) for headings and dialog */
  slotDisplayName: string;
  onCancel: () => void;
  /** Called after successful submit (e.g. close dialog) */
  onSuccess?: () => void;
}

export const SelectPhotoForFusedSlotForm = ({
  primaryFusedSlotId,
  slots,
  slotDisplayName,
  onCancel,
  onSuccess,
}: SelectPhotoForFusedSlotFormProps) => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const photomone = t?.photomone || {};
  const sellPhoto = photomone?.sellPhoto || {};
  const selectFused = photomone?.selectPhotoForFusedSlot || {};

  const uploadImageToFusedSlotMutation = SlotApis.useUploadImageToFusedSlot();

  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Exclude slots that are petrified, in market, or have score < 4
  const filteredSlots = slots.filter((slot) => {
    if (slot.isPetrified === true) return false;
    if ((slot as Slot & { inMarket?: boolean }).inMarket === true) return false;
    if (typeof slot.score === "number" && slot.score < 4.5) return false;
    return true;
  });

  const hasMoreThan12Photos = filteredSlots.length > 12;
  const displayedPhotos =
    hasMoreThan12Photos && !showAllPhotos
      ? filteredSlots.slice(0, 12)
      : filteredSlots;

  const handleSubmit = () => {
    if (!selectedSlot || !primaryFusedSlotId) return;
    uploadImageToFusedSlotMutation.mutate(
      {
        fusedSlotId: primaryFusedSlotId,
        slotId: selectedSlot._id,
      },
      {
        onSuccess: () => {
          showToast(
            selectFused.successMessage ??
              "Photo assigned to slot successfully.",
            "success"
          );
          onSuccess?.();
        },
        onError: (error: {
          response?: { data?: { message?: string } };
          message?: string;
        }) => {
          const raw =
            error?.response?.data?.message ||
            error?.message ||
            (selectFused.assignFailed ??
              "Failed to assign photo to slot. Please try again.");
          showToast(
            translateAssignFusedPhotoError(raw, selectFused.assignFailed),
            "error"
          );
        },
      }
    );
  };

  return (
    <Box className="space-y-4 pt-2">
      <Box className="space-y-3">
        <ThemeText
          text={(
            selectFused.headingTemplate ?? "Select photos for {{slot}} slot"
          ).replace(/\{\{slot\}\}/g, slotDisplayName)}
        />
        <Box className="rounded-lg h-[calc(100vh-380px)] max-h-[360px] overflow-y-auto">
          {filteredSlots.length > 0 ? (
            <Box className="grid grid-cols-3 gap-2 sm:gap-3">
              {displayedPhotos.map((slot) => {
                const isSelected = selectedSlot?._id === slot._id;
                return (
                  <Box
                    key={slot._id}
                    onClick={() => setSelectedSlot(isSelected ? null : slot)}
                    className="relative cursor-pointer rounded-lg overflow-hidden aspect-square border transition-all duration-200 hover:shadow-md"
                    sx={{
                      borderColor: isSelected ? COLORS.primary : "#E0E0E0",
                      borderWidth: isSelected ? 2 : 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={slot.imageUrl!}
                      alt={(sellPhoto.altSlot ?? "Gallery slot {slotNumber}").replace(
                        "{slotNumber}",
                        String(slot.slotNumber ?? "")
                      )}
                      className="w-full h-full object-cover block"
                    />
                    {isSelected && (
                      <Box
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: COLORS.primary,
                        }}
                      >
                        <CheckIcon sx={{ color: "#fff", fontSize: 16 }} />
                      </Box>
                    )}
                  </Box>
                );
              })}
              {hasMoreThan12Photos && !showAllPhotos && (
                <Box
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square bg-[#F5F5F5] border border-[#E0E0E0] relative flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-200"
                >
                  <Typography className="font-medium font-inter text-[#333] text-sm sm:text-base">
                    {sellPhoto.showMore || "Show more"}
                  </Typography>
                </Box>
              )}
              {hasMoreThan12Photos && showAllPhotos && (
                <Box
                  onClick={() => setShowAllPhotos(false)}
                  className="aspect-square bg-[#F5F5F5] border border-[#E0E0E0] relative flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-200"
                >
                  <Typography className="font-medium font-inter text-[#333] text-sm sm:text-base">
                    {sellPhoto.showLess || "Show less"}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box className="flex items-center justify-center h-full min-h-[200px]">
              <Typography className="text-[#758599] font-proxima text-sm">
                {selectFused.noPhotosYet ??
                  "No photos in your gallery for fusion yet"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
        <OutlineButton onClick={onCancel} className="flex-1 !min-w-[120px]">
          {selectFused.cancel ?? photomone?.sellPhoto?.cancel ?? "Cancel"}
        </OutlineButton>
        <MainButton
          onClick={handleSubmit}
          disabled={
            !selectedSlot ||
            !primaryFusedSlotId ||
            uploadImageToFusedSlotMutation.isPending
          }
          color={COLORS.primary}
          className="flex-1 !min-w-[120px] !rounded-full"
        >
          {uploadImageToFusedSlotMutation.isPending
            ? (selectFused.submitting ?? "Submitting…")
            : (selectFused.submit ?? "Submit")}
        </MainButton>
      </Box>
    </Box>
  );
};

export default SelectPhotoForFusedSlotForm;
