import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  DashboardHeading,
  PointsCard,
  EarningsCard,
  LockyCard,
  CompleteProfileDialog,
  Loading,
  TabBar,
  MainButton,
  ThemeText,
} from "@components";
import {
  GallerySlot,
  NoticeTabScreen,
  MissionsTabScreen,
} from "../components";
import { SlotDetailDialog } from "../components/SlotDetailDialog";
import { useAuthContext, useLanguage } from "@providers";
import { GalleryIcon, MissionsIcon, NoticeIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import { SlotApis } from "@apis";
import type {
  Mission,
  Notice,
  Slot,
  SlotDetailsData,
  SlotDetailsResponse,
} from "@types";

interface HomeScreenProps {
  variant?: "dashboard" | "notice";
  slots: Slot[];
  isLoading?: boolean;
  notices: Notice[];
  noticesLoading: boolean;
  missions: Mission[];
  missionsLoading: boolean;
  missionsIsError: boolean;
  missionsError: unknown;
  onCollectMission: (missionId: string) => void;
  collectingMissionId: string | null;
}

export const HomeScreen = ({
  variant = "dashboard",
  slots,
  isLoading = false,
  notices,
  noticesLoading,
  missions,
  missionsLoading,
  missionsIsError,
  missionsError,
  onCollectMission,
  collectingMissionId,
}: HomeScreenProps) => {
  const { authUser } = useAuthContext();
  const { translations } = useLanguage();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showSlotDetail, setShowSlotDetail] = useState(false);

  // Keep selectedSlot in sync with slots (e.g. after reveal points refetch)
  useEffect(() => {
    if (selectedSlot && slots.length > 0) {
      const updated = slots.find((s) => s._id === selectedSlot._id);
      if (updated) setSelectedSlot(updated);
    }
  }, [slots]);

  const t = translations || {};
  const home = t.home || {};
  const tabs = home.tabs || {};
  const isProfileCompleted = authUser?.profileCompleted ?? false;
  const userPoints = authUser?.points ?? 0;
  const hasInsufficientPoints = userPoints < 200;

  const homeTabs = [
    {
      label: tabs.gallery || "Gallery",
      icon: (isActive: boolean) => (
        <GalleryIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : "#758599"}
        />
      ),
    },
    {
      label: tabs.notice || "Notice",
      icon: (isActive: boolean) => (
        <NoticeIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : "#758599"}
        />
      ),
    },
    {
      label: tabs.missions || "Missions",
      icon: (isActive: boolean) => (
        <MissionsIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : "#758599"}
        />
      ),
    },
  ];

  const hasMoreThan7Slots = slots.length > 7;
  const displayedSlots =
    hasMoreThan7Slots && !showAllSlots ? slots.slice(0, 7) : slots;

  const totalGridItems =
    displayedSlots.length + (hasMoreThan7Slots ? 1 : 0) + 1;

  const numberOfRows = Math.ceil(totalGridItems / 4);
  const needsScrolling = numberOfRows > 3;

  useEffect(() => {
    if (authUser && !authUser.profileCompleted) {
      const timer = setTimeout(() => {
        setShowProfileModal(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authUser?._id, authUser?.profileCompleted]);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
  };

  const updateSlotMutation = SlotApis.useUpdateSlot();

  const handleSlotClick = (slot: Slot) => {
    if (slot.imageUrl) {
      updateSlotMutation.mutate(slot._id); // Fire and forget; on success invalidates slots
      setSelectedSlot(slot);
      setShowSlotDetail(true);
    }
  };

  // Slot details come from the selected slot (get all slots response includes full details)
  const slotDetailsData: SlotDetailsResponse | null = selectedSlot
    ? { status: "success", data: selectedSlot as SlotDetailsData }
    : null;

  if (variant === "notice") {
    return (
      <Box>
        <DashboardHeading
          title={tabs.notice || "Notice"}
          className="mb-6 lg:block hidden"
        />
        <Box className="max-h-[calc(100vh-375px)] lg:max-h-[calc(100vh-390px)] overflow-y-auto">
          <NoticeTabScreen notices={notices} isLoading={noticesLoading} />
        </Box>
        <CompleteProfileDialog
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onComplete={handleProfileComplete}
          userName={authUser?.fullName || ""}
        />
        <SlotDetailDialog
          open={showSlotDetail}
          onClose={() => {
            setShowSlotDetail(false);
            setSelectedSlot(null);
          }}
          slot={selectedSlot}
          slotDetailsData={slotDetailsData}
          isLoading={false}
        />
      </Box>
    );
  }

  // tooltip={home.gallery?.tooltip || "Once a photo is uploaded to a slot, it cannot be deleted or replaced."}
  return (
    <Box>
      <DashboardHeading
        title={home.title || "HOME"}
        className="mb-6 lg:block hidden"
      />

      {/* Points, Earnings & Locky — mobile: 2 + 1 rows; sm+: single row of 3 */}
      <Box className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:mb-6 mb-4">
        <PointsCard
          points={authUser?.points ?? 0}
          hideLabelOnMobile
        />
        <EarningsCard
          earnings={authUser?.earnings ?? 0}
          hideLabelOnMobile
        />
        <LockyCard
          locky={authUser?.locky ?? 0}
          className="col-span-2 sm:col-span-1"
          hideLabelOnMobile
        />
      </Box>

      {/* Tabs */}
      <Box className="lg:mb-6 mb-4">
        <TabBar
          tabs={homeTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Mobile Gallery Layout - Flex with equal spacing */}
          <Box className="block sm:hidden mt-2 max-h-[calc(100vh-375px)] !overflow-y-auto">
            {isLoading ? (
              <Box className="flex items-center justify-center py-16">
                <Loading size={40} />
              </Box>
            ) : (
              <Box
                className=""
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.75rem", // Consistent 12px gap for both horizontal and vertical
                  maxHeight: needsScrolling ? "1232px" : "none",
                  overflowY: needsScrolling ? "auto" : "visible",
                }}
              >
                {displayedSlots.map((slot) => (
                  <GallerySlot
                    key={slot._id}
                    slotId={slot._id}
                    slotNumber={slot.slotNumber}
                    variant="mobile"
                    disabled={!isProfileCompleted}
                    imageUrl={slot.imageUrl}
                    isNew={slot.isNew}
                    isPetrified={slot.isPetrified}
                    onSlotClick={() => handleSlotClick(slot)}
                  />
                ))}
                {hasMoreThan7Slots && !showAllSlots && (
                  <Box
                    onClick={() => setShowAllSlots(true)}
                    className="w-[calc((100vw-56px)/3)] h-[calc((100vw-56px)/3)] relative flex flex-col items-center justify-center gap-1 rounded-lg cursor-pointer transition-all duration-200"
                    sx={{
                      backgroundColor: COLORS.white,
                      border: `1px dashed ${COLORS.border}`,
                      "&:hover": {
                        backgroundColor: "#F9F9F9",
                        borderColor: COLORS.grayStrong,
                      },
                    }}
                  >
                    <Typography
                      className="font-medium font-inter text-sm"
                      sx={{ color: COLORS.grayStrong }}
                    >
                      {home.slot?.showMore || "Show more"}
                    </Typography>
                  </Box>
                )}
                {hasMoreThan7Slots && showAllSlots && (
                  <Box
                    onClick={() => setShowAllSlots(false)}
                    className="w-[calc((100vw-56px)/3)] lg:max-h-[calc((100vh-300px))] relative flex flex-col items-center justify-center gap-1 rounded-lg cursor-pointer transition-all duration-200"
                    sx={{
                      backgroundColor: COLORS.white,
                      border: `1px dashed ${COLORS.border}`,
                      "&:hover": {
                        backgroundColor: "#F9F9F9",
                        borderColor: COLORS.grayStrong,
                      },
                    }}
                  >
                    <Typography
                      className="font-medium font-inter text-sm"
                      sx={{ color: COLORS.grayStrong }}
                    >
                      {home.slot?.showLess || "Show less"}
                    </Typography>
                  </Box>
                )}
                <GallerySlot
                  slotNumber={slots.length + 1}
                  isAddSlot
                  variant="mobile"
                  currentSlots={slots.length}
                  disabled={hasInsufficientPoints}
                />
              </Box>
            )}

            {/* Mobile Info Box */}
            {!isProfileCompleted && (
              <Box
                className="p-4 rounded-[10px] mt-2"
                sx={{
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.secondary}`,
                  borderRadius: "10px",
                }}
              >
                <Box className="flex flex-col items-start gap-3">
                  <ThemeText
                    text={
                      <>
                        <span className="font-semibold">
                          {" "}
                          {home.profile?.completeYourProfile ||
                            "Complete Your Profile:"}
                        </span>{" "}
                        <span className="font-normal">
                          {home.profile?.completeProfileMessage ||
                            "Please complete your profile before uploading photos."}
                        </span>
                      </>
                    }
                  />
                  <MainButton onClick={() => setShowProfileModal(true)}>
                    {home.profile?.completeProfileButton || "Complete Profile"}
                  </MainButton>
                </Box>
              </Box>
            )}
          </Box>

          {/* Desktop/Tablet Gallery Layout */}
          <Box className="hidden sm:block max-h-[calc(100vh-390px)] overflow-y-auto p-0 mt-2">
            {isLoading ? (
              <Box className="flex items-center justify-center py-20">
                <Loading size={48} />
              </Box>
            ) : (
              <Box
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 justify-items-center max-w-[1200px] mx-auto"
                sx={{
                  maxHeight: needsScrolling ? "1232px" : "none",
                  overflowY: needsScrolling ? "auto" : "visible",
                }}
              >
                {displayedSlots.map((slot) => (
                  <GallerySlot
                    key={slot._id}
                    slotId={slot._id}
                    slotNumber={slot.slotNumber}
                    variant="desktop"
                    disabled={!isProfileCompleted}
                    imageUrl={slot.imageUrl}
                    isNew={slot.isNew}
                    isPetrified={slot.isPetrified}
                    onSlotClick={() => handleSlotClick(slot)}
                  />
                ))}
                {hasMoreThan7Slots && !showAllSlots && (
                  <Box
                    onClick={() => setShowAllSlots(true)}
                    className="aspect-square w-full max-w-[400px] relative flex flex-col items-center justify-center gap-5 rounded-xl cursor-pointer transition-all duration-200"
                    sx={{
                      backgroundColor: COLORS.white,
                      border: `1px dashed ${COLORS.border}`,
                      "&:hover": {
                        backgroundColor: "#F9F9F9",
                        borderColor: COLORS.grayStrong,
                      },
                    }}
                  >
                    <Typography
                      className="font-medium font-inter text-lg"
                      sx={{ color: COLORS.grayStrong }}
                    >
                      {home.slot?.showMore || "Show more"}
                    </Typography>
                  </Box>
                )}
                {hasMoreThan7Slots && showAllSlots && (
                  <Box
                    onClick={() => setShowAllSlots(false)}
                    className="aspect-square w-full max-w-[400px] relative flex flex-col items-center justify-center gap-5 rounded-xl cursor-pointer transition-all duration-200"
                    sx={{
                      backgroundColor: COLORS.white,
                      border: `1px dashed ${COLORS.border}`,
                      "&:hover": {
                        backgroundColor: "#F9F9F9",
                        borderColor: COLORS.grayStrong,
                      },
                    }}
                  >
                    <Typography
                      className="font-medium font-inter text-lg"
                      sx={{ color: COLORS.grayStrong }}
                    >
                      {home.slot?.showLess || "Show less"}
                    </Typography>
                  </Box>
                )}
                <GallerySlot
                  slotNumber={slots.length + 1}
                  isAddSlot
                  variant="desktop"
                  currentSlots={slots.length}
                  disabled={hasInsufficientPoints}
                />
              </Box>
            )}

            {/* Desktop Info Box */}
            {!isProfileCompleted && (
              <Box
                className="p-4 rounded-xl mt-5"
                sx={{
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.secondary}`,
                }}
              >
                <Box className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Box className="flex gap-1">
                    <ThemeText
                      text={
                        home.profile?.completeYourProfileColon ||
                        "Complete Your Profile:"
                      }
                      className="font-semibold "
                    />
                    <ThemeText
                      text={
                        home.profile?.completeProfileMessage ||
                        "Please complete your profile before uploading photos."
                      }
                    />
                  </Box>
                  <MainButton onClick={() => setShowProfileModal(true)}>
                    {home.profile?.completeProfileButton || "Complete Profile"}
                  </MainButton>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}

      {activeTab === 1 && (
        <Box className="max-h-[calc(100vh-375px)] lg:max-h-[calc(100vh-390px)] overflow-y-auto">
          <NoticeTabScreen notices={notices} isLoading={noticesLoading} />
        </Box>
      )}

      {activeTab === 2 && (
        <Box className="max-h-[calc(100vh-375px)] lg:max-h-[calc(100vh-390px)] overflow-y-auto">
          <MissionsTabScreen
            missions={missions}
            isLoading={missionsLoading}
            isError={missionsIsError}
            error={missionsError}
            onCollectMission={onCollectMission}
            collectingMissionId={collectingMissionId}
          />
        </Box>
      )}

      {/* Complete Profile Dialog */}
      <CompleteProfileDialog
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={handleProfileComplete}
        userName={authUser?.fullName || ""}
      />

      {/* Slot Detail Dialog */}
      <SlotDetailDialog
        open={showSlotDetail}
        onClose={() => {
          setShowSlotDetail(false);
          setSelectedSlot(null);
        }}
        slot={selectedSlot}
        slotDetailsData={slotDetailsData}
        isLoading={false}
      />
    </Box>
  );
};

export default HomeScreen;
