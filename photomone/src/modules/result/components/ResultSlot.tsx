import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { ResultPurchaseSlotDialog } from "./ResultPurchaseSlotDialog";
import type { PurchasedImage } from "@types";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";

interface ResultSlotProps {
  isAddSlot?: boolean;
  variant: "mobile" | "desktop";
  purchase?: PurchasedImage;
  currentSlots?: number;
  slotNumber?: number;
}

export const ResultSlot = ({
  isAddSlot = false,
  variant,
  purchase,
  currentSlots = 0,
  slotNumber = 1,
}: ResultSlotProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const slot = resultTranslations?.slot || {};
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const isMobile = variant === "mobile";
  // Mobile: 100vw - 32px (px-4 padding) - 24px (2 gaps of 12px) = 100vw - 56px, divided by 3
  const sizeClass = isMobile
    ? "w-[calc((100vw-56px)/3)] h-[calc((100vw-56px)/3)]"
    : "w-full max-w-[400px]";

  // Circle with plus icon for add slot - match GallerySlot (grayMuted)
  const grayMuted = COLORS.grayStrong;
  const addIconSvg = (w: number, h: number) =>
    `<svg width='${w}' height='${h}' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='12' cy='12' r='10' stroke='${grayMuted}' stroke-width='1.5'/><path d='M12 8V16M8 12H16' stroke='${grayMuted}' stroke-width='1.5' stroke-linecap='round'/></svg>`;
  const addIconSrc = isMobile
    ? `data:image/svg+xml,${encodeURIComponent(addIconSvg(24, 24))}`
    : `data:image/svg+xml,${encodeURIComponent(addIconSvg(40, 40))}`;

  const iconSize = isMobile ? "w-6 h-6" : "w-10 h-10";
  const textSize = isMobile ? "text-sm" : "text-lg";
  const gapClass = isMobile ? "gap-1" : "gap-5";

  // Calculate time remaining for expiration
  useEffect(() => {
    if (!purchase?.filled || !purchase?.expirationTime) {
      setTimeRemaining("");
      return;
    }

    const expiredText = slot.expired || "Expired";

    const updateTimer = () => {
      const expirationDate = new Date(purchase.expirationTime!);
      const now = new Date();
      const diff = expirationDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining(expiredText);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const tmHoursMinutes =
        slot.timeHoursMinutes || "{hours}h {minutes}m";
      const tmMinutes = slot.timeMinutes || "{minutes}m";
      const tmSeconds = slot.timeSeconds || "{seconds}s";
      if (hours > 0) {
        setTimeRemaining(
          tmHoursMinutes
            .replace("{hours}", String(hours))
            .replace("{minutes}", String(minutes))
        );
      } else if (minutes > 0) {
        setTimeRemaining(tmMinutes.replace("{minutes}", String(minutes)));
      } else {
        setTimeRemaining(tmSeconds.replace("{seconds}", String(seconds)));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [
    purchase?.expirationTime,
    purchase?.filled,
    slot.expired,
    slot.timeHoursMinutes,
    slot.timeMinutes,
    slot.timeSeconds,
  ]);

  if (isAddSlot) {
    return (
      <>
        <Box
          onClick={() => setShowPurchaseDialog(true)}
          className={`aspect-square ${sizeClass} bg-white border-1 border-dashed relative flex flex-col items-center justify-center ${gapClass} rounded-lg cursor-pointer transition-all duration-200 hover:border-[#758599] hover:bg-[#F9F9F9]`}
          sx={{ borderColor: COLORS.border }}
        >
          <Box
            component="img"
            src={addIconSrc}
            alt={slot.addSlot || "Add slot"}
            className={iconSize}
          />
          <Typography
            className={`font-medium font-inter ${textSize}`}
            sx={{ color: grayMuted }}
          >
            {slot.addSlot || "Add Slot"}
          </Typography>
        </Box>

        <ResultPurchaseSlotDialog
          open={showPurchaseDialog}
          onClose={() => setShowPurchaseDialog(false)}
          currentSlots={currentSlots}
        />
      </>
    );
  }

  // Show image if filled, otherwise show empty slot
  if (purchase?.filled && purchase?.imageUrl) {
    const expiredText = slot.expired || "Expired";
    const isExpired = timeRemaining === expiredText;
    const expiresText = slot.expires || "Expires: {timeRemaining}";

    return (
      <Box
        className={`aspect-square ${sizeClass} bg-white border relative rounded-lg overflow-hidden`}
        sx={{ borderColor: "#E0E0E0" }}
      >
        {/* Image */}
        <Box
          component="img"
          src={purchase.imageUrl}
          alt={
            (resultTranslations?.a11y?.purchasedSlotImage ||
              "Purchased photo in slot {number}")
              .replace("{number}", String(purchase.index))
          }
          className="w-full h-full object-cover"
        />

        {/* Expiration overlay - semi-transparent dark grey, white text */}
        {timeRemaining && (
          <Box
            className="absolute bottom-0 left-0 right-0 py-2 px-2"
            sx={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <Typography
              className="text-center font-medium text-white"
              sx={{
                fontSize: { xs: "10px", sm: "12px" },
                color: isExpired ? "#EF4444" : "white",
              }}
            >
              {isExpired
                ? expiredText
                : expiresText.replace("{timeRemaining}", timeRemaining)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      className={`aspect-square ${sizeClass} bg-white border relative flex flex-col items-center justify-center ${gapClass} rounded-lg overflow-hidden hover:bg-[#F9F9F9] transition-colors duration-200`}
      sx={{ borderColor: "#E0E0E0" }}
    >
      <Typography
        className={`font-proxima font-medium ${textSize}`}
        sx={{ color: COLORS.generalText }}
      >
        {(slot.slotLabel || "Slot {number}").replace(
          "{number}",
          String(slotNumber)
        )}
      </Typography>
    </Box>
  );
};
