import { Box, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { UploadPhotoDialog } from "./UploadPhotoDialog";
import { PurchaseSlotDialog } from "./PurchaseSlotDialog";
import { MainButton } from "@components";
// import { CloudUploadIcon } from "@assets/icons/svg";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";

const PETRIFIED_ORANGE = "#F9A602";

interface GallerySlotProps {
  slotNumber: number;
  slotId?: string;
  isAddSlot?: boolean;
  variant: "mobile" | "desktop";
  disabled?: boolean;
  imageUrl?: string | null;
  currentSlots?: number;
  onSlotClick?: () => void;
  isNew?: boolean;
  isPetrified?: boolean;
}

export const GallerySlot = ({
  slotNumber,
  slotId = "",
  isAddSlot = false,
  variant,
  disabled = false,
  imageUrl,
  currentSlots = 0,
  onSlotClick,
  isNew = false,
  isPetrified = false,
}: GallerySlotProps) => {
  // Match Tailwind sm (640px): below that = mobile, show text only and no button
  const isSmallScreen = useMediaQuery("(max-width:639px)");
  const { translations } = useLanguage();
  const t = translations || {};
  const home = t.home || {};
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const isMobile = variant === "mobile";
  // Mobile: 100vw - 32px (px-4 padding) - 24px (2 gaps of 12px) = 100vw - 56px, divided by 3
  const sizeClass = isMobile
    ? "w-[calc((100vw-56px)/3)] h-[calc((100vw-56px)/3)]"
    : "w-full max-w-[400px]";

  // Circle with plus icon for add slot only
  const grayMuted = COLORS.grayStrong; // #758599
  const addIconSrc = isMobile
    ? `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' stroke='${encodeURIComponent(grayMuted)}' stroke-width='1.5'/%3E%3Cpath d='M12 8V16M8 12H16' stroke='${encodeURIComponent(grayMuted)}' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E`
    : `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' stroke='${encodeURIComponent(grayMuted)}' stroke-width='1.5'/%3E%3Cpath d='M12 8V16M8 12H16' stroke='${encodeURIComponent(grayMuted)}' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E`;

  const iconSize = isMobile ? "w-6 h-6" : "w-10 h-10";
  const textSize = isMobile ? "text-sm" : "text-lg";
  const gapClass = isMobile ? "gap-1" : "gap-5";

  if (isAddSlot) {
    return (
      <>
        <Box
          onClick={() => !disabled && setShowPurchaseDialog(true)}
          className={`aspect-square ${sizeClass} bg-white border-1 border-dashed relative flex flex-col items-center justify-center ${gapClass} rounded-lg ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-[#758599] hover:bg-[#F9F9F9]"} transition-all duration-200`}
          sx={{ borderColor: COLORS.border }}
        >
          <Box
            component="img"
            src={addIconSrc}
            alt={home.slot?.addSlot || "Add slot"}
            className={iconSize}
          />
          <Typography
            className={`font-medium font-inter ${textSize}`}
            sx={{ color: grayMuted }}
          >
            {home.slot?.addSlot || "Add Slot"}
          </Typography>
        </Box>

        <PurchaseSlotDialog
          open={showPurchaseDialog}
          onClose={() => setShowPurchaseDialog(false)}
          currentSlots={currentSlots}
          maxSlots={99}
        />
      </>
    );
  }

  // If imageUrl exists, show the image with gradient overlay
  if (imageUrl) {
    return (
      <Box
        onClick={onSlotClick}
        className={`aspect-square ${sizeClass} relative rounded-lg overflow-hidden transition-all duration-200 ${isPetrified ? "opacity-85 cursor-default" : "hover:opacity-90 cursor-pointer"}`}
        sx={{
          ...(isPetrified && {
            border: `3px solid ${PETRIFIED_ORANGE}`,
            boxSizing: "border-box",
            filter: "grayscale(0.4)",
          }),
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={`Slot ${slotNumber}`}
          className="w-full h-full object-cover"
        />
        {/* New badge at top right */}
        {isNew && !isPetrified && (
          <Box
            className={`absolute top-1 right-1 bg-gradient-to-r from-[#7245EF] to-[#0D9DFD] text-white font-inter font-semibold rounded-full flex items-center justify-center ${isMobile ? "text-[8px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"}`}
          >
            {home.slot?.new || "NEW"}
          </Box>
        )}
        {/* Gradient overlay at bottom */}
        <Box
          className="absolute bottom-0 left-0 right-0 h-12 flex items-end justify-center pb-2"
          sx={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
          }}
        >
          <Typography
            className={`font-medium font-inter text-white ${isMobile ? "text-xs" : "text-sm"}`}
          >
            {isPetrified
              ? (home.slot?.expired ?? "Expired")
              : `${home.slot?.label || "Slot"} ${slotNumber}`}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        onClick={(e) => {
          if (disabled) return;
          if ((e.target as HTMLElement).closest?.("button")) return;
          setShowUploadDialog(true);
        }}
        className={`aspect-square ${sizeClass} bg-white border border-[#E0E0E0] relative flex flex-col items-center justify-center ${gapClass} rounded-lg overflow-hidden ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-[#F9F9F9]"} transition-colors duration-200`}
      >
        {/* {isSmallScreen ? <CloudUploadIcon width={32} height={32} /> : <></>} */}
        <Typography className={`font-proxima font-medium mt-2 ${textSize}`}>
          {home.slot?.label || "Slot"} {slotNumber}
        </Typography>
        {!isSmallScreen && (
          <MainButton
            onClick={() => {
              if (!disabled) setShowUploadDialog(true);
            }}
            disabled={disabled}
          >
            {home.slot?.uploadPhoto || "Upload Photo"}
          </MainButton>
        )}
      </Box>

      <UploadPhotoDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        slotNumber={slotNumber}
        slotId={slotId}
      />
    </>
  );
};
