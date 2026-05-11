import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Person } from "@mui/icons-material";
import {
  MainDialog,
  DialogStepper,
  MainButton,
  OutlineButton,
  ValidatedInput,
  ValidatedSelect,
  ValidatedTextarea,
  CountrySelect,
} from "@components";
import { useAuthContext, useLanguage } from "@providers";
import { COLORS } from "@constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidations } from "@validations";
import { UserApis } from "@apis";

interface ProfileData {
  displayName: string;
  gender: string;
  preferredGender: string;
  ageGroup: string;
  country: string;
  introduction: string;
  profilePhoto: string | null;
}

interface CompleteProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (profileData: ProfileData) => void;
  userName?: string;
}

export const CompleteProfileDialog = ({
  open,
  onClose,
  onComplete,
  userName = "",
}: CompleteProfileDialogProps) => {
  const { refreshUser } = useAuthContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const profileTranslations = t?.profile || {};
  const completeProfileTranslations =
    profileTranslations?.completeProfile || {};
  const placeholders = profileTranslations?.placeholders || {};
  const genderOptionsTranslations = profileTranslations?.genderOptions || {};
  const buttons = completeProfileTranslations?.buttons || {};
  const stepsTranslations = completeProfileTranslations?.steps || {};
  const messages = completeProfileTranslations?.messages || {};
  const validation = profileTranslations?.validation || {};

  const completeProfileMutation = UserApis.useCompleteProfile();

  const completeProfileSchema =
    UserValidations.createFormCompleteProfileSchema(validation);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [completedProfileData, setCompletedProfileData] =
    useState<ProfileData | null>(null);
  const profilePhotoUrlRef = useRef<string | null>(null);
  const profilePhotoFileRef = useRef<File | null>(null);

  const steps = [
    stepsTranslations.basic || "Basic",
    stepsTranslations.profilePhoto || "Profile Photo",
  ];
  const completeProfileStepperSteps = [
    {
      id: 1,
      label: stepsTranslations.step1Label || "STEP 1",
      title: stepsTranslations.basic || "Basic",
    },
    {
      id: 2,
      label: stepsTranslations.step2Label || "STEP 2",
      title: stepsTranslations.profilePhoto || "Profile Photo",
    },
    {
      id: 3,
      label: stepsTranslations.step3Label || "STEP 3",
      title: stepsTranslations.reward || "Reward",
    },
  ];
  const ageGroupOptions = ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"];

  // Gender options with translations, but keep English keys for API mapping
  const genderOptionsData = [
    { label: genderOptionsTranslations.male || "Male", value: "Male" },
    { label: genderOptionsTranslations.female || "Female", value: "Female" },
    {
      label: genderOptionsTranslations.preferNotToSay || "Prefer not to say",
      value: "Prefer not to say",
    },
  ];

  const ageGroupSelectOptions = ageGroupOptions.map((o) => ({
    value: o,
    label: o,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<UserValidations.FormCompleteProfileType>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      displayName: userName,
      gender: "",
      preferredGender: "Female",
      ageGroup: "",
      country: "",
      introduction: "",
    },
  });

  // Reset form when dialog opens with new userName
  useEffect(() => {
    if (open) {
      reset({
        displayName: userName,
        gender: "",
        preferredGender: "Female",
        ageGroup: "",
        country: "",
        introduction: "",
      });
      setActiveStep(0);
      setProfilePhoto(null);
      setPhotoError(null);
    }
  }, [open, userName, reset]);

  const handleNext = async () => {
    if (activeStep === 0) {
      const isValid = await trigger([
        "displayName",
        "gender",
        "ageGroup",
        "country",
        "introduction",
      ]);
      if (isValid) {
        setActiveStep(1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (profilePhotoUrlRef.current) {
        URL.revokeObjectURL(profilePhotoUrlRef.current);
      }

      const localUrl = URL.createObjectURL(file);
      profilePhotoUrlRef.current = localUrl;
      profilePhotoFileRef.current = file;
      setProfilePhoto(localUrl);
      setPhotoError(null);
    }
  };

  const onSubmit = async (data: UserValidations.FormCompleteProfileType) => {
    // Validate photo
    if (!profilePhoto) {
      setPhotoError(
        messages.profilePhotoRequired || "Profile photo is required"
      );
      return;
    }

    // Map gender values to API format
    const genderMap: Record<string, string> = {
      Male: "male",
      Female: "female",
      "Prefer not to say": "other",
    };
    const preferredGenderMap: Record<string, string> = {
      Male: "male",
      Female: "female",
      Both: "both",
    };

    completeProfileMutation.mutate(
      {
        profileData: {
          fullName: data.displayName,
          gender: genderMap[data.gender] || data.gender.toLowerCase(),
          ageGroup: data.ageGroup,
          preferredGender:
            preferredGenderMap[data.preferredGender] ||
            data.preferredGender.toLowerCase(),
          introduction: data.introduction,
          country: data.country,
        },
        avatar: profilePhotoFileRef.current || undefined,
      },
      {
        onSuccess: async () => {
          await refreshUser();
          const payload: ProfileData = {
            displayName: data.displayName,
            gender: data.gender,
            preferredGender: data.preferredGender,
            ageGroup: data.ageGroup,
            country: data.country,
            introduction: data.introduction,
            profilePhoto: profilePhoto,
          };
          setCompletedProfileData(payload);
          setActiveStep(2);
        },
      }
    );
  };

  const handleComplete = () => {
    if (!profilePhoto) {
      setPhotoError(
        messages.profilePhotoRequired || "Profile photo is required"
      );
      return;
    }
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    return () => {
      if (profilePhotoUrlRef.current) {
        URL.revokeObjectURL(profilePhotoUrlRef.current);
        profilePhotoUrlRef.current = null;
      }
      profilePhotoFileRef.current = null;
    };
  }, []);

  const handleDone = () => {
    if (completedProfileData) {
      onComplete(completedProfileData);
      onClose();
    }
  };

  const currentStepperStep = activeStep + 1;
  const stepperStepCompleted = (stepId: number) => activeStep >= stepId;
  const stepperStepLocked = (stepId: number) => activeStep < stepId - 1;

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={completeProfileTranslations.title || "Complete Your Profile"}
      subtitle={
        completeProfileTranslations.subtitle ||
        "Get 100 free points upon completion"
      }
      maxWidth="md"
      hideCloseButton
      centerTitle
    >
      <Box className="mt-6">
        <DialogStepper
          steps={completeProfileStepperSteps}
          currentStep={currentStepperStep}
          stepCompleted={stepperStepCompleted}
          isStepLocked={stepperStepLocked}
        />
        {activeStep === 0 && (
          <Box
            className="flex flex-col gap-4 mt-6 border rounded-2xl py-2 px-4"
            sx={{ borderColor: COLORS.border }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: COLORS.generalText, mb: 1 }}
            >
              {stepsTranslations.basicInformation || "Basic Information"}
            </Typography>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ValidatedInput
                placeholder={
                  placeholders.enterDisplayName || "Enter your display name"
                }
                register={register("displayName")}
                error={errors.displayName?.message}
                required
                variant="outlined"
              />
              <ValidatedSelect
                placeholder={placeholders.selectGender || "Select Gender"}
                register={register("gender")}
                error={errors.gender?.message}
                options={genderOptionsData}
                variant="outlined"
              />
              <ValidatedSelect
                placeholder={placeholders.selectAgeGroup || "Select Age Group"}
                register={register("ageGroup")}
                error={errors.ageGroup?.message}
                options={ageGroupSelectOptions}
                variant="outlined"
              />
              <CountrySelect
                label=""
                placeholder={placeholders.selectCountry || "Select your country"}
                register={register("country")}
                error={errors.country?.message}
                variant="outlined"
              />
              <Box sx={{ gridColumn: "1 / -1" }}>
                <ValidatedTextarea
                  placeholder={placeholders.tellAboutYourself || "Introduction"}
                  register={register("introduction")}
                  error={errors.introduction?.message}
                  rows={3}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        )}
        {activeStep === 1 && (
          <Box
            className="flex flex-col gap-4 mt-6 border rounded-2xl py-2 px-4"
            sx={{ borderColor: COLORS.border }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: COLORS.generalText, mb: 1 }}
            >
              {stepsTranslations.profilePhoto || "Profile Photo"}
            </Typography>
            <Box className="flex flex-col items-center gap-4">
              <Box className="relative">
                <Avatar
                  src={profilePhoto || undefined}
                  className="!w-30 !h-30 !border-3 !border-[#29C4D6] !shadow-lg"
                  sx={{
                    opacity: completeProfileMutation.isPending ? 0.6 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  <Person sx={{ fontSize: 48, color: COLORS.grayLight }} />
                </Avatar>
                {completeProfileMutation.isPending && (
                  <Box
                    className="!absolute !inset-0 !flex !items-center !justify-center !bg-black/50 !rounded-full"
                    sx={{
                      zIndex: 10,
                    }}
                  >
                    <CircularProgress
                      size={40}
                      sx={{ color: COLORS.primary }}
                    />
                  </Box>
                )}
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  disabled={completeProfileMutation.isPending}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 10000,
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                    "&:hover": {
                      backgroundColor: COLORS.primary,
                      opacity: 0.9,
                    },
                    "&.Mui-disabled": { opacity: 0.5 },
                  }}
                >
                  <PhotoCamera />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handlePhotoUpload}
                    disabled={completeProfileMutation.isPending}
                  />
                </IconButton>
              </Box>
              {photoError && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ fontSize: "12px" }}
                >
                  {photoError}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        {activeStep === 2 && (
          <Box
            className="flex flex-col items-center justify-center gap-6 py-8 px-4"
            sx={{ minHeight: 260 }}
          >
            <Box
              className="flex items-center justify-center w-24 h-24 rounded-full"
              sx={{
                backgroundColor: `${COLORS.primary}18`,
                border: `3px solid ${COLORS.primary}`,
                animation:
                  "points-earned-scale 0.5s ease-out, points-earned-glow 2s ease-in-out 0.5s infinite",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: COLORS.primary,
                  lineHeight: 1,
                }}
              >
                100
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: COLORS.generalText,
                textAlign: "center",
              }}
            >
              {messages.pointsEarnedTitle || "You've earned 100 points!"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: COLORS.grayStrong,
                textAlign: "center",
                maxWidth: 320,
              }}
            >
              {messages.pointsEarnedSubtitle ||
                "Thanks for completing your profile."}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        className="!pt-4 !pb-2 flex flex-col items-center w-full gap-4"
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: COLORS.white,
          zIndex: 1,
        }}
      >
        {completeProfileMutation.isError && activeStep !== 2 && (
          <Box className="w-full mb-4 p-3 bg-[#DE1C3920] border border-[#DE1C39] rounded-lg">
            <Typography className="!text-[#DE1C39] !text-sm text-center">
              {completeProfileMutation.error?.message ||
                messages.completeProfileFailed ||
                "Failed to complete profile"}
            </Typography>
          </Box>
        )}
        <Box className="flex flex-wrap justify-center items-center gap-4 w-full max-w-[500px] mx-auto">
          {activeStep === 2 ? (
            <MainButton onClick={handleDone} className="!w-full">
              {buttons.done || "Done"}
            </MainButton>
          ) : (
            <>
              {activeStep > 0 && (
                <OutlineButton
                  onClick={handleBack}
                  className="flex-1 !min-w-[120px] !bg-white"
                >
                  {buttons.back || "Back"}
                </OutlineButton>
              )}
              <MainButton
                color={COLORS.secondary}
                onClick={onClose}
                className="flex-1 !min-w-[120px]"
              >
                {buttons.skip || "Skip"}
              </MainButton>
              {activeStep < steps.length - 1 ? (
                <MainButton
                  onClick={handleNext}
                  className="flex-1 !min-w-[120px]"
                >
                  {buttons.next || "Next"}
                </MainButton>
              ) : (
                <MainButton
                  onClick={handleComplete}
                  disabled={completeProfileMutation.isPending}
                  className="!w-full"
                >
                  {completeProfileMutation.isPending ? (
                    <Box className="flex items-center justify-center gap-2">
                      <span>{buttons.uploadingAndSaving || "Saving..."}</span>
                    </Box>
                  ) : (
                    buttons.completeProfile || "Complete Profile"
                  )}
                </MainButton>
              )}
            </>
          )}
        </Box>
      </Box>
    </MainDialog>
  );
};

export default CompleteProfileDialog;
