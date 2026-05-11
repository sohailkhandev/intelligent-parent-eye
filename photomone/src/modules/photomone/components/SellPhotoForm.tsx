import { Box, Typography, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";
import {
  DialogStepper,
  MainButton,
  OutlineButton,
  TabBar,
  Loading,
} from "@components";
import { MarketData } from "@types";
import type { Slot, PurchasedImage } from "@types";
import { MarketApis, PurchaseApis } from "@apis";
import { useAppContext, useAuthContext, useLanguage } from "@providers";
import { COLORS } from "@constants";
import { prepareSuccessChime } from "@utils";

interface SellPhotoFormProps {
  selectedMarket: MarketData;
  remainingEntries: number;
  slots: Slot[];
  onCancel: () => void;
  /** Called when user dismisses the success message (e.g. to close dialog or refresh) */
  onSuccess?: (data: { exposuresCount: number; marketLabel: string }) => void;
}

export const SellPhotoForm = ({
  selectedMarket,
  remainingEntries,
  slots,
  onCancel,
  onSuccess,
}: SellPhotoFormProps) => {
  const { showToast } = useAppContext();
  const { refreshUser } = useAuthContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const photomone = t?.photomone || {};
  const sellPhoto = photomone?.sellPhoto || {};
  const expiration = photomone?.expiration || {};

  const [step, setStep] = useState<number>(1);
  const [exposuresCount, setExposuresCount] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchasedImage | null>(null);
  const [activePhotoTab, setActivePhotoTab] = useState(0);
  const [purchaseTimers, setPurchaseTimers] = useState<Record<string, string>>(
    {}
  );
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllPurchased, setShowAllPurchased] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  const createExposuresMutation = MarketApis.useCreateExposures();

  const photoTabs = [
    { label: sellPhoto.tabs?.photos || "Photos" },
    { label: sellPhoto.tabs?.purchased || "Purchased" },
  ];

  // Fetch purchased images
  const { data: purchasedImagesData, isLoading: isLoadingPurchases } =
    PurchaseApis.useGetPurchasedImages();

  // Filter to show only filled purchases
  const purchasedPhotos = useMemo(() => {
    const purchases = purchasedImagesData?.data?.purchases || [];
    return purchases.filter((purchase) => purchase.filled && purchase.imageUrl);
  }, [purchasedImagesData]);

  // Don't show gallery photos that are in market or petrified
  const myPhotos = useMemo(
    () =>
      slots.filter((slot) => {
        if ((slot as Slot & { inMarket?: boolean }).inMarket === true)
          return false;
        if ((slot as Slot & { isPetrified?: boolean }).isPetrified === true)
          return false;
        return true;
      }),
    [slots]
  );

  // Show more/less logic for Photos tab
  const hasMoreThan12Photos = myPhotos.length > 12;
  const displayedPhotos =
    hasMoreThan12Photos && !showAllPhotos ? myPhotos.slice(0, 12) : myPhotos;

  // Show more/less logic for Purchased tab
  const hasMoreThan12Purchased = purchasedPhotos.length > 12;
  const displayedPurchased =
    hasMoreThan12Purchased && !showAllPurchased
      ? purchasedPhotos.slice(0, 12)
      : purchasedPhotos;

  // Calculate expiration timers for purchased photos
  useEffect(() => {
    if (purchasedPhotos.length === 0) return;

    const updateTimers = () => {
      const timers: Record<string, string> = {};

      purchasedPhotos.forEach((purchase) => {
        if (!purchase.expirationTime) {
          timers[purchase._id] = "";
          return;
        }

        const expirationDate = new Date(purchase.expirationTime);
        const now = new Date();
        const diff = expirationDate.getTime() - now.getTime();

        if (diff <= 0) {
          timers[purchase._id] = expiration.expired || "Expired";
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          const hLabel = expiration.hours || "h";
          const mLabel = expiration.minutes || "m";
          const sLabel = expiration.seconds || "s";

          if (hours > 0) {
            // Show hours and minutes only (no seconds)
            timers[purchase._id] = `${hours}${hLabel} ${minutes}${mLabel}`;
          } else if (minutes > 0) {
            // Show minutes only (no seconds) when more than 1 minute remaining
            timers[purchase._id] = `${minutes}${mLabel}`;
          } else {
            // Show seconds only when in the last minute (60s to 0s)
            timers[purchase._id] = `${seconds}${sLabel}`;
          }
        }
      });

      setPurchaseTimers(timers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, [purchasedPhotos, expiration]);

  const handleImageSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setSelectedPurchase(null);
    setStep(2);
  };

  const handlePurchaseSelect = (purchase: PurchasedImage) => {
    setSelectedPurchase(purchase);
    setSelectedSlot(null);
    setStep(2);
  };

  const maxExposures = Math.max(1, Math.min(99, remainingEntries));
  const handleExposuresIncrement = () => {
    setExposuresCount((prev) => (prev < maxExposures ? prev + 1 : prev));
  };
  const handleExposuresDecrement = () => {
    setExposuresCount((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextStep = () => {
    if (step === 1 && (selectedSlot || selectedPurchase)) {
      setStep(2);
      setExposuresCount(1);
    } else if (step === 2) {
      setStep(3);
    }
  };
  const handleBackStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleSell = () => {
    if (!selectedSlot && !selectedPurchase) return;

    const slotId = selectedSlot?._id ?? selectedPurchase?._id ?? "";
    if (!slotId) return;

    prepareSuccessChime(); // Unlock audio on user gesture so sell-success chime can play when dialog opens
    const marketNumber = parseInt(selectedMarket.id.replace("Market-", ""), 10);
    setIsSelling(true);
    const exposuresForThisSell = exposuresCount;
    const marketLabel = selectedMarket.label ?? "";

    createExposuresMutation.mutate(
      {
        marketNumber,
        slotId,
        exposures: exposuresCount,
      },
      {
        onSuccess: () => {
          refreshUser();
          setIsSelling(false);
          onSuccess?.({
            exposuresCount: exposuresForThisSell,
            marketLabel,
          });
        },
        onError: (error) => {
          setIsSelling(false);
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ??
            (error as Error)?.message ??
            "";
          showToast(
            message || sellPhoto.sellFailedGeneric || "Something went wrong",
            "error"
          );
        },
      }
    );
  };

  const sellPhotoStepperSteps = [
    {
      id: 1,
      label: sellPhoto.step1Label || "STEP 1",
      title: sellPhoto.step1Title || "Select",
    },
    {
      id: 2,
      label: sellPhoto.step2Label || "STEP 2",
      title: sellPhoto.stepExposures || sellPhoto.step2Title || "Exposures",
    },
    {
      id: 3,
      label: sellPhoto.step3Label || "STEP 3",
      title: sellPhoto.stepDetails || sellPhoto.step3Title || "Details",
    },
  ];
  const stepCompleted = (stepId: number) => step > stepId;
  const isStepLocked = (stepId: number) => step < stepId;

  return (
    <Box className="space-y-2 sm:space-y-3 pt-4">
      <DialogStepper
        steps={sellPhotoStepperSteps}
        currentStep={step}
        stepCompleted={stepCompleted}
        isStepLocked={isStepLocked}
      />

      {/* Step 1: Photo Gallery Tabs */}
      {step === 1 && (
        <>
          <Box className="space-y-3">
            <TabBar
              tabs={photoTabs}
              activeTab={activePhotoTab}
              onTabChange={setActivePhotoTab}
            />

            {/* Tab Content - Fixed height container with internal scroll */}
            <Box className="rounded-lg h-[calc(100vh-350px)] max-h-[400px] overflow-y-auto">
              {/* Tab 0 - Photos */}
              <Box
                className="h-[calc(100vh-350px)] max-h-[400px]"
                sx={{
                  display: activePhotoTab === 0 ? "block" : "none",
                }}
              >
                {myPhotos.length > 0 ? (
                  <Box className="grid grid-cols-3 gap-2 sm:gap-3">
                    {displayedPhotos.map((slot) => {
                      const isSelected = selectedSlot?._id === slot._id;
                      return (
                        <Box
                          key={slot._id}
                          className="relative cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg overflow-hidden aspect-square border"
                          onClick={() => handleImageSelect(slot)}
                          sx={{
                            borderColor: isSelected
                              ? `${COLORS.primary}`
                              : "#E0E0E0",
                          }}
                        >
                          <Box
                            component="img"
                            src={slot.imageUrl!}
                            alt={(sellPhoto.altSlot || "Slot {slotNumber}").replace(
                              "{slotNumber}",
                              String(slot.slotNumber ?? "")
                            )}
                            className="w-full h-full object-cover"
                          />
                          {isSelected ? (
                            <Box
                              className="absolute top-1/2 -translate-1/2 left-1/2  flex items-center justify-center rounded-full"
                              sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: `${COLORS.primary}`,
                              }}
                            >
                              <CheckIcon sx={{ color: "#fff", fontSize: 16 }} />
                            </Box>
                          ) : (
                            <Box className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/10" />
                          )}
                        </Box>
                      );
                    })}
                    {hasMoreThan12Photos && !showAllPhotos && (
                      <Box
                        onClick={() => setShowAllPhotos(true)}
                        className="aspect-square bg-[#F5F5F5] border border-[#E0E0E0] relative flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-200"
                      >
                        <Typography className="font-medium  text-[#333] text-sm sm:text-base">
                          {sellPhoto.showMore || "Show more"}
                        </Typography>
                      </Box>
                    )}
                    {hasMoreThan12Photos && showAllPhotos && (
                      <Box
                        onClick={() => setShowAllPhotos(false)}
                        className="aspect-square bg-[#F5F5F5] border border-[#E0E0E0] relative flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-200"
                      >
                        <Typography className="font-medium  text-[#333] text-sm sm:text-base">
                          {sellPhoto.showLess || "Show less"}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box className="flex items-center justify-center h-full">
                    <Typography className="text-[#758599] text-sm">
                      {sellPhoto.uploadPhotoFirst ||
                        "Upload photo first to join"}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Tab 1 - Purchased */}
              <Box
                className="h-[calc(100vh-350px)] max-h-[400px]"
                sx={{
                  display: activePhotoTab === 1 ? "block" : "none",
                }}
              >
                {isLoadingPurchases ? (
                  <Box className="flex items-center justify-center h-full">
                    <Loading size={48} />
                  </Box>
                ) : purchasedPhotos.length > 0 ? (
                  <Box className="grid grid-cols-3 gap-2 sm:gap-3">
                    {displayedPurchased.map((purchase) => {
                      const isSelected = selectedPurchase?._id === purchase._id;
                      const timeRemaining = purchaseTimers[purchase._id] || "";
                      const expiredText = expiration.expired || "Expired";
                      const isExpired = timeRemaining === expiredText;

                      return (
                        <Box
                          key={purchase._id}
                          className="relative cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg overflow-hidden aspect-square border"
                          sx={{
                            borderColor: isExpired
                              ? "#EF4444"
                              : isSelected
                                ? `${COLORS.primary}`
                                : "#E0E0E0",
                          }}
                          onClick={() => handlePurchaseSelect(purchase)}
                        >
                          <Box
                            component="img"
                            src={purchase.imageUrl!}
                            alt={(sellPhoto.altPurchased || "Purchased {index}")
                              .replace("{index}", String(purchase.index ?? ""))}
                            className="w-full h-full object-cover"
                          />
                          {/* Expiration Timer - At bottom */}
                          {timeRemaining && (
                            <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 py-2 px-2">
                              <Typography
                                className="text-center font-bold text-white"
                                sx={{
                                  fontSize: { xs: "10px", sm: "12px" },
                                  color: isExpired ? "#EF4444" : "#4CAF50",
                                }}
                              >
                                {isExpired
                                  ? expiration.expired || "Expired"
                                  : (
                                      sellPhoto.expires ||
                                      "Expires: {timeRemaining}"
                                    ).replace("{timeRemaining}", timeRemaining)}
                              </Typography>
                            </Box>
                          )}
                          {isSelected ? (
                            <Box
                              className="absolute top-1/2 -translate-1/2 left-1/2  flex items-center justify-center rounded-full z-10"
                              sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: `${COLORS.primary}`,
                              }}
                            >
                              <CheckIcon sx={{ color: "#fff", fontSize: 16 }} />
                            </Box>
                          ) : null}
                        </Box>
                      );
                    })}
                    {hasMoreThan12Purchased && !showAllPurchased && (
                      <Box
                        onClick={() => setShowAllPurchased(true)}
                        className="aspect-square bg-[#F5F5F5] border border-[#E0E0E0] relative flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-200"
                      >
                        <Typography className="font-medium  text-[#333] text-sm sm:text-base">
                          {sellPhoto.showMore || "Show more"}
                        </Typography>
                      </Box>
                    )}
                    {hasMoreThan12Purchased && showAllPurchased && (
                      <Box
                        onClick={() => setShowAllPurchased(false)}
                        className="aspect-square bg-[#F5F5F5] border border-[#E0E0E0] relative flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-200"
                      >
                        <Typography className="font-medium  text-[#333] text-sm sm:text-base">
                          {sellPhoto.showLess || "Show less"}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box className="flex items-center justify-center h-full">
                    <Typography className="text-[#758599] text-sm">
                      {sellPhoto.noPurchasedPhotos || "No purchased photos"}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Step 2: Exposures count selection */}
      {step === 2 && (
        <>
          <Box
            className="rounded-2xl border p-6 sm:p-8"
            sx={{
              borderColor: COLORS.border,
              backgroundColor: `${COLORS.primary}06`,
            }}
          >
            {/* Remaining exposures — compact label */}
            <Box className="flex justify-center mb-5">
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: `${COLORS.primary}14`,
                  border: `1px solid ${COLORS.primary}30`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.primary,
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                  }}
                >
                  {(
                    sellPhoto.entriesRemaining ||
                    "{remainingEntries} exposures remaining"
                  ).replace("{remainingEntries}", String(remainingEntries))}
                </Typography>
              </Box>
            </Box>
            {/* Count control */}
            <Box className="flex items-center justify-center gap-6 sm:gap-8">
              <IconButton
                onClick={handleExposuresDecrement}
                disabled={exposuresCount <= 1}
                className="!w-12 !h-12 !rounded-full !transition-all !duration-200 hover:!scale-105 disabled:!opacity-50 disabled:!cursor-not-allowed"
                sx={{
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.primary}`,
                  color: COLORS.primary,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  "&:hover:not(.Mui-disabled)": {
                    backgroundColor: `${COLORS.primary}15`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <RemoveIcon />
              </IconButton>
              <Box className="text-center min-w-[72px]">
                <Typography
                  variant="h3"
                  className="!text-4xl !font-bold !mb-0.5 !leading-tight"
                  sx={{ color: COLORS.generalText }}
                >
                  {exposuresCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.grayStrong, fontSize: "0.8125rem" }}
                  className=""
                >
                  {exposuresCount === 1
                    ? sellPhoto.exposure || "exposure"
                    : sellPhoto.exposures || "exposures"}
                </Typography>
              </Box>
              <IconButton
                onClick={handleExposuresIncrement}
                disabled={exposuresCount >= maxExposures}
                className="!w-12 !h-12 !rounded-full !transition-all !duration-200 hover:!scale-105 disabled:!opacity-50 disabled:!cursor-not-allowed"
                sx={{
                  backgroundColor: COLORS.white,
                  border: `2px solid ${COLORS.primary}`,
                  color: COLORS.primary,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  "&:hover:not(.Mui-disabled)": {
                    backgroundColor: `${COLORS.primary}15`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-6">
            <OutlineButton
              onClick={handleBackStep}
              className="flex-1 !min-w-[120px]"
            >
              {sellPhoto.back || "Back"}
            </OutlineButton>
            <MainButton
              onClick={handleNextStep}
              color={COLORS.primary}
              className="flex-1 !min-w-[120px]"
            >
              {sellPhoto.next || "Next"}
            </MainButton>
          </Box>
        </>
      )}

      {/* Step 3: Details — Market Name, Exposures selected, Photo, Sell/Cancel */}
      {step === 3 && (
        <>
          {/* Remaining Entries Badge - Only show for paid markets */}
          {!selectedMarket.isFree && (
            <Box className="flex justify-end mb-2">
              <Box
                className="px-4 py-2 rounded-full"
                sx={{
                  backgroundColor: `${COLORS.primary}14`,
                  border: `1px solid ${COLORS.primary}40`,
                }}
              >
                <Typography
                  className="text-sm font-semibold "
                  sx={{ color: COLORS.primary }}
                >
                  {(
                    sellPhoto.entriesRemaining ||
                    "{remainingEntries} exposures remaining"
                  ).replace(
                    "{remainingEntries}",
                    remainingEntries.toString()
                  )}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Market Details - light card */}
          {selectedMarket && (
            <Box
              className="p-3 rounded-[10px] space-y-2 mb-3"
              sx={{
                border: "1px solid #E0E0E0",
                backgroundColor: COLORS.white,
              }}
            >
              <Typography
                className="text-[16px] font-semibold"
                sx={{ color: COLORS.generalText }}
              >
                {sellPhoto.marketDetails || "Market Details"}
              </Typography>
              <Box className="flex items-center justify-between">
                <Typography
                  className="text-sm"
                  sx={{ color: COLORS.grayStrong }}
                >
                  {sellPhoto.selectedMarket || "Selected Market:"}
                </Typography>
                <Typography
                  className="font-medium text-base"
                  sx={{ color: COLORS.generalText }}
                >
                  {selectedMarket.label}
                </Typography>
              </Box>
              <Box
                className="flex items-center justify-between pt-2 border-t"
                sx={{ borderColor: "#E0E0E0" }}
              >
                <Typography
                  className="text-sm"
                  sx={{ color: COLORS.grayStrong }}
                >
                  {sellPhoto.exposuresSelected || "Exposures selected:"}
                </Typography>
                <Typography
                  className=" font-semibold text-base"
                  sx={{ color: COLORS.generalText }}
                >
                  {exposuresCount}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Selected Photo Preview - light card */}
          {(selectedSlot || selectedPurchase) && (
            <Box
              className="p-3 rounded-xl mb-3"
              sx={{
                border: "1px solid #E0E0E0",
                backgroundColor: COLORS.white,
              }}
            >
              <Typography
                className="text-[16px] font-semibold mb-2"
                sx={{ color: COLORS.generalText }}
              >
                {sellPhoto.selectedPhoto || "Selected Photo"}
              </Typography>
              <Box className="flex items-center justify-center gap-4">
                <Box
                  component="img"
                  src={
                    selectedSlot?.imageUrl || selectedPurchase?.imageUrl || ""
                  }
                  alt={sellPhoto.altSelectedPhoto || "Selected photo"}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                />
              </Box>
            </Box>
          )}

          {/* Sell & Cancel Buttons - side by side like PurchaseSlotDialog */}
          <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
            <OutlineButton
              onClick={onCancel}
              disabled={createExposuresMutation.isPending || isSelling}
              className="flex-1 !min-w-[120px]"
            >
              {sellPhoto.cancel || "Cancel"}
            </OutlineButton>
            <MainButton
              onClick={handleSell}
              disabled={
                (!selectedSlot && !selectedPurchase) ||
                createExposuresMutation.isPending ||
                isSelling
              }
              color={COLORS.primary}
              className="flex-1 !min-w-[120px]"
            >
              {createExposuresMutation.isPending || isSelling ? (
                <span>{sellPhoto.selling || "Selling..."}</span>
              ) : (
                sellPhoto.sell || "Sell"
              )}
            </MainButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SellPhotoForm;
