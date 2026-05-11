import { useState, useRef } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  DeleteAccountDialog,
  TabBar,
  DashboardHeading,
  MainButton,
  CardTitle,
} from "@components";
import { EditProfileDialog } from "../components";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { UserApis } from "@apis";
import {
  EditProfileIcon,
  RewardsIcon,
  CameraIcon,
  EditPencilIcon,
  TrashIcon,
} from "@assets/icons/svg";
import { COLORS } from "@constants";

export const ProfileScreen = () => {
  const { authUser, refreshUser } = useAuthContext();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const profileTranslations = t?.profile || {};
  const tabs = profileTranslations?.screenTabs || {};
  const comingSoon = profileTranslations?.comingSoon || {};
  const screen = profileTranslations?.screen || {};
  const messages = profileTranslations?.messages || {};
  const profileA11y = profileTranslations?.a11y || {};

  const [activeTab, setActiveTab] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileTabs = [
    {
      label: tabs.profile || "Profile",
      icon: (isActive: boolean) => (
        <EditProfileIcon color={isActive ? COLORS.white : COLORS.grayStrong} />
      ),
    },
    {
      label: tabs.rewards || tabs.wallet || "Rewards",
      icon: (isActive: boolean) => (
        <RewardsIcon
          width={18}
          height={16}
          color={isActive ? COLORS.white : COLORS.grayStrong}
        />
      ),
    },
  ];

  const uploadPictureMutation = UserApis.useUploadProfilePicture();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast(
        messages.pleaseSelectImageFile || "Please select an image file",
        "error"
      );
      return;
    }

    // Validate file size (max 1MB - backend limit)
    if (file.size > 1 * 1024 * 1024) {
      showToast(
        messages.imageSizeShouldBeLessThan1MB ||
          "Image size should be less than 1MB",
        "error"
      );
      return;
    }

    uploadPictureMutation.mutate(file, {
      onSuccess: async () => {
        await refreshUser();
        showToast(
          messages.profilePictureUpdatedSuccess ||
            "Profile picture updated successfully",
          "success"
        );
      },
      onError: (error) => {
        showToast(
          error?.message ||
            messages.profilePictureUpdateFailed ||
            "Failed to update profile picture",
          "error"
        );
      },
    });

    // Reset input so the same file can be selected again
    event.target.value = "";
  };

  return (
    <Box className="min-h-[calc(100vh-160px)] pb-6 sm:pb-0">
      {/* Heading */}
      <DashboardHeading
        title={profileTranslations.heading || "ACCOUNT"}
        className="mb-4 sm:mb-6 lg:block hidden"
      />

      {/* Tabs */}
      <Box className="mb-4 lg:mb-6">
        <TabBar
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-label={
              profileA11y.changeProfilePhoto || "Change profile photo"
            }
          />

          {/* Profile Information Card */}
          <Box
            className="rounded-2xl border p-5 sm:p-4 lg:p-6"
            sx={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
          >
            <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-5">
              {/* Avatar + name: centered column on mobile, row on desktop */}
              <Box className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left sm:gap-4 sm:flex-1">
                {/* Avatar + camera badge wrapper for clear touch target */}
                <Box
                  onClick={handleAvatarClick}
                  className="relative flex-shrink-0 cursor-pointer touch-manipulation"
                  sx={{ minWidth: 0 }}
                >
                  <Box
                    className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden group border-2"
                    sx={{ borderColor: COLORS.primary }}
                  >
                    {authUser?.profilePicture ? (
                      <Box
                        component="img"
                        src={authUser.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Box className="w-full h-full flex items-center justify-center font-bold text-2xl sm:text-xl font-proxima text-white bg-[#9CA3AF]">
                        {authUser?.fullName?.charAt(0) || "?"}
                      </Box>
                    )}

                    {/* Hover/Loading Overlay */}
                    <Box
                      className={`absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity duration-200 ${
                        uploadPictureMutation.isPending
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {uploadPictureMutation.isPending ? (
                        <CircularProgress
                          size={22}
                          sx={{ color: COLORS.white }}
                        />
                      ) : (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </Box>
                  </Box>

                  {/* Camera Badge: larger touch target on mobile */}
                  <Box
                    onClick={handleAvatarClick}
                    className="absolute -right-1 -bottom-1 w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer z-10 touch-manipulation"
                    sx={{
                      backgroundColor: COLORS.primary,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <CameraIcon />
                  </Box>
                </Box>

                {/* User Info */}
                <Box className="flex-1 mt-3 sm:mt-0 min-w-0">
                  <CardTitle
                    title={authUser?.fullName || screen.user || "User"}
                    className="text-lg sm:text-base"
                  />
                </Box>
              </Box>

              {/* Action Buttons: full-width, 48px min height on mobile */}
              <Box className="flex flex-col sm:flex-row gap-4 sm:gap-3 lg:justify-end w-full sm:w-auto">
                <MainButton
                  onClick={() => setShowEditModal(true)}
                  color={COLORS.primary}
                  className="sm:min-w-[140px] !py-3 sm:!py-2 !rounded-full"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <EditPencilIcon />
                    {profileTranslations?.editProfile || "Edit Profile"}
                  </span>
                </MainButton>

                <MainButton
                  onClick={() => setShowDeleteDialog(true)}
                  color="#FF2A3B"
                  className="sm:min-w-[140px] !py-3 sm:!py-2 !rounded-full"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <TrashIcon />
                    {profileTranslations?.deleteProfile || "Delete Profile"}
                  </span>
                </MainButton>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {activeTab === 1 && (
        <Box
          className="rounded-2xl border p-5"
          sx={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
        >
          <CardTitle
            title={comingSoon.title || "Coming Soon"}
            className="mb-3"
          />
        </Box>
      )}

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={() => setShowEditModal(false)}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </Box>
  );
};
