import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import {
  MainDialog,
  Loading,
  TabBar,
  ValidatedInput,
  ValidatedTextarea,
  ValidatedSelect,
  OutlineButton,
  MainButton,
  CountrySelect,
  getCountryList,
} from "@components";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidations } from "@validations";
import { UserApis } from "@apis";
import { capitalize } from "@utils";
import { COLORS } from "@constants";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const EditProfileDialog = ({
  open,
  onClose,
  onSave,
}: EditProfileDialogProps) => {
  const { authUser, refreshUser } = useAuthContext();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const profileTranslations = t?.profile || {};
  const tabs = profileTranslations?.tabs || {};
  const fields = profileTranslations?.fields || {};
  const placeholders = profileTranslations?.placeholders || {};
  const genderOptions = profileTranslations?.genderOptions || {};
  const buttons = profileTranslations?.buttons || {};
  const messages = profileTranslations?.messages || {};
  const validation = profileTranslations?.validation || {};
  const ageGroupLabels = profileTranslations?.ageGroupOptions || {};
  const updateProfileMutation = UserApis.useUpdateProfile();
  const changePasswordMutation = UserApis.useChangePassword();
  const [activeTab, setActiveTab] = useState(0);

  const editProfileSchema =
    UserValidations.createFormEditProfileSchema(validation);
  const changePasswordSchema =
    UserValidations.createFormChangePasswordSchema(validation);

  // Only show password tab if user is not a Google signup
  const tabsData = useMemo(() => {
    const tabLabels = [
      {
        label: tabs.profileInformation ?? tabs.profile ?? "Profile Information",
      },
    ];
    if (!authUser?.isGoogleSignup) {
      tabLabels.push({
        label: tabs.changePassword ?? tabs.password ?? "Change Password",
      });
    }
    return tabLabels;
  }, [
    authUser,
    tabs.profileInformation,
    tabs.profile,
    tabs.changePassword,
    tabs.password,
  ]);

  const ageGroupOptions = useMemo(() => {
    const L = ageGroupLabels;
    return [
      { value: "18-25", label: L["18-25"] || "18 – 25 years" },
      { value: "26-35", label: L["26-35"] || "26 – 35 years" },
      { value: "36-45", label: L["36-45"] || "36 – 45 years" },
      { value: "46-55", label: L["46-55"] || "46 – 55 years" },
      { value: "56-65", label: L["56-65"] || "56 – 65 years" },
      { value: "65+", label: L["65+"] || "65+" },
    ];
  }, [ageGroupLabels]);

  const genderSelectOptions = useMemo(
    () => [
      { value: "Male", label: genderOptions.male || "Male" },
      { value: "Female", label: genderOptions.female || "Female" },
      { value: "Other", label: genderOptions.other || "Other" },
      {
        value: "Prefer not to say",
        label: genderOptions.preferNotToSay || "Prefer not to say",
      },
    ],
    [
      genderOptions.male,
      genderOptions.female,
      genderOptions.other,
      genderOptions.preferNotToSay,
    ]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserValidations.FormEditProfileType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: "",
      ageGroup: "",
      country: "",
      introduction: "",
    },
  });

  // Reset form when dialog opens with authUser data
  useEffect(() => {
    if (authUser && open) {
      let countryName = authUser.country || "";
      if (countryName) {
        const countryList = getCountryList();
        const selected = countryList.find(
          (c) => c.code === countryName || c.name === countryName
        );
        if (selected) countryName = selected.name;
      }

      reset({
        displayName: authUser.fullName || "",
        ageGroup: authUser.ageGroup || "",
        country: countryName,
        introduction: authUser.introduction || "",
      });
    }
  }, [authUser, open, reset]);

  const onSubmit = async (data: UserValidations.FormEditProfileType) => {
    // Map to API format - keep gender from authUser (not editable)
    const genderMap: Record<string, string> = {
      Male: "male",
      Female: "female",
      "Prefer not to say": "other",
      Other: "other",
    };

    const profileData = {
      fullName: data.displayName,
      gender:
        genderMap[capitalize(authUser?.gender || "")] ||
        authUser?.gender?.toLowerCase() ||
        "other",
      ageGroup: data.ageGroup,
      preferredGender: authUser?.preferredGender || "both",
      introduction: data.introduction,
      country: data.country,
    };

    updateProfileMutation.mutate(profileData, {
      onSuccess: async () => {
        await refreshUser();
        showToast(
          messages.profileUpdatedSuccess || "Profile updated successfully",
          "success"
        );
        onSave();
        onClose();
      },
      onError: (error) => {
        showToast(
          error?.message ||
            messages.profileUpdateFailed ||
            "Failed to update profile",
          "error"
        );
      },
    });
  };

  // Change Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isDirty: isPasswordDirty },
    reset: resetPassword,
  } = useForm<UserValidations.FormChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (
    data: UserValidations.FormChangePasswordType
  ) => {
    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          showToast(
            messages.passwordUpdatedSuccess || "Password updated successfully",
            "success"
          );
          resetPassword();
        },
        onError: (error) => {
          showToast(
            error?.message ||
              messages.passwordUpdateFailed ||
              "Failed to change password",
            "error"
          );
        },
      }
    );
  };

  // Reset activeTab to 0 if password tab is removed and user is on tab 1
  useEffect(() => {
    if (activeTab === 1 && (authUser as any)?.isGoogleSignup) {
      setActiveTab(0);
    }
  }, [authUser, activeTab]);

  const handleClose = () => {
    reset({
      displayName: "",
      ageGroup: "",
      country: "",
      introduction: "",
    });
    resetPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setActiveTab(0);
    onClose();
  };

  return (
    <MainDialog
      open={open}
      onClose={handleClose}
      title={
        profileTranslations.editProfileDialogTitle ||
        profileTranslations.editProfile ||
        "Edit Profile"
      }
      maxWidth="lg"
    >
      <Box className="mt-6 space-y-4 sm:space-y-6">
        {/* Tabs */}
        {!authUser?.isGoogleSignup && (
          <TabBar
            tabs={tabsData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Display Name - full width */}
            <ValidatedInput
              variant="outlined"
              label={fields.displayName || "Display Name"}
              placeholder={placeholders.enterDisplayName || "John Doe"}
              register={register("displayName")}
              error={errors.displayName?.message}
            />

            {/* Email + Gender - 2 columns */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ValidatedInput
                variant="outlined"
                type="email"
                label={fields.email || "Email"}
                value={authUser?.email || ""}
                disabled
              />
              <ValidatedSelect
                variant="outlined"
                label={fields.gender || "Gender"}
                placeholder={placeholders.selectGender || "Select Gender"}
                options={genderSelectOptions}
                value={capitalize(authUser?.gender || "")}
                disabled
              />
            </Box>

            {/* Age Group + Country - 2 columns */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ValidatedSelect
                variant="outlined"
                label={fields.ageGroup || "Age Group"}
                placeholder={placeholders.selectAgeGroup || "Select Age Group"}
                register={register("ageGroup")}
                options={ageGroupOptions}
                error={errors.ageGroup?.message}
              />
              <CountrySelect
                label={fields.country || "Country"}
                placeholder={
                  placeholders.selectCountry || "Select your country"
                }
                register={register("country")}
                error={errors.country?.message}
                variant="outlined"
              />
            </Box>

            {/* Introduction - full width */}
            <ValidatedTextarea
              variant="outlined"
              label={fields.introduction || "Introduction"}
              placeholder={
                placeholders.tellAboutYourself || "Tell us about yourself..."
              }
              register={register("introduction")}
              error={errors.introduction?.message}
              rows={3}
            />

            {/* Actions - horizontal: Cancel + Save (flex-1 like other dialogs) */}
            <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
              <OutlineButton
                type="button"
                onClick={handleClose}
                className="flex-1 !min-w-[120px]"
              >
                {buttons.cancel || "Cancel"}
              </OutlineButton>
              <MainButton
                type="submit"
                disabled={updateProfileMutation.isPending || !isDirty}
                color={COLORS.primary}
                className="flex-1 !min-w-[120px]"
              >
                {updateProfileMutation.isPending ? (
                  <Box className="flex items-center justify-center gap-2">
                    <Loading size={16} />
                    <span>{buttons.saving || "Saving..."}</span>
                  </Box>
                ) : (
                  buttons.saveChanges || "Save Changes"
                )}
              </MainButton>
            </Box>
          </Box>
        )}

        {/* Change Password Tab */}
        {activeTab === 1 && !(authUser as any)?.isGoogleSignup && (
          <Box
            component="form"
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="rounded-2xl border p-4 sm:p-6 space-y-4"
            sx={{ borderColor: COLORS.border }}
          >
            <ValidatedInput
              variant="outlined"
              type="password"
              label={fields.currentPassword || "Current Password"}
              placeholder={
                placeholders.enterCurrentPassword ||
                "Enter your current password"
              }
              register={registerPassword("currentPassword")}
              error={passwordErrors.currentPassword?.message}
            />

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ValidatedInput
                variant="outlined"
                type="password"
                label={fields.newPassword || "New Password"}
                placeholder={
                  placeholders.enterNewPassword ||
                  "Enter new password (min. 6 characters)"
                }
                register={registerPassword("newPassword")}
                error={passwordErrors.newPassword?.message}
              />
              <ValidatedInput
                variant="outlined"
                type="password"
                label={fields.confirmNewPassword || "Confirm New Password"}
                placeholder={
                  placeholders.confirmNewPassword || "Confirm your new password"
                }
                register={registerPassword("confirmPassword")}
                error={passwordErrors.confirmPassword?.message}
              />
            </Box>

            {/* Actions - horizontal: Cancel + Update (flex-1 like other dialogs) */}
            <Box className="flex flex-row gap-3 justify-center items-center flex-wrap w-full pt-2">
              <OutlineButton
                type="button"
                onClick={handleClose}
                className="flex-1 !min-w-[120px]"
              >
                {buttons.cancel || "Cancel"}
              </OutlineButton>
              <MainButton
                type="submit"
                disabled={changePasswordMutation.isPending || !isPasswordDirty}
                color={COLORS.primary}
                className="flex-1 !min-w-[120px]"
              >
                {changePasswordMutation.isPending ? (
                  <Box className="flex items-center justify-center gap-2">
                    <Loading size={16} />
                    <span>{buttons.updating || "Updating..."}</span>
                  </Box>
                ) : (
                  buttons.updatePassword || buttons.update || "Update Password"
                )}
              </MainButton>
            </Box>
          </Box>
        )}
      </Box>
    </MainDialog>
  );
};
