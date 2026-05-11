import { Box, Typography } from "@mui/material";
import { GradientButton, Loading } from "@components";
import { useAppContext, useLanguage } from "@providers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidations } from "@validations";
import { UserApis } from "@apis";

export const ChangePasswordForm = () => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const profileTranslations = t?.profile || {};
  const fields = profileTranslations?.fields || {};
  const placeholders = profileTranslations?.placeholders || {};
  const buttons = profileTranslations?.buttons || {};
  const messages = profileTranslations?.messages || {};
  const validation = profileTranslations?.validation || {};
  const changePasswordMutation = UserApis.useChangePassword();

  const changePasswordSchema =
    UserValidations.createFormChangePasswordSchema(validation);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserValidations.FormChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UserValidations.FormChangePasswordType) => {
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
          reset();
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-2xl"
    >
      <Box>
        <Typography className="block text-sm lg:text-base mb-2 font-proxima font-medium text-white/80">
          {fields.currentPassword || "Current Password"}
        </Typography>
        <input
          type="password"
          {...register("currentPassword")}
          placeholder={
            placeholders.enterCurrentPassword || "Enter your current password"
          }
          className={`appearance-none block w-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px] bg-[#0000004D] border-2 rounded-full ${
            errors.currentPassword
              ? "border-red-500 focus:border-red-500"
              : "border-[#0D9DFD1F] focus:border-[#0D9DFD] hover:border-[#0D9DFD]/50"
          }`}
        />
        {errors.currentPassword && (
          <Typography className="!text-red-500 !text-xs !mt-1 !font-inter">
            {errors.currentPassword.message}
          </Typography>
        )}
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Box>
          <Typography className="block text-sm lg:text-base mb-2 font-proxima font-medium text-white/80">
            {fields.newPassword || "New Password"}
          </Typography>
          <input
            type="password"
            {...register("newPassword")}
            placeholder={
              placeholders.enterNewPassword ||
              "Enter new password (min. 6 characters)"
            }
            className={`appearance-none block w-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px] bg-[#0000004D] border-2 rounded-full ${
              errors.newPassword
                ? "border-red-500 focus:border-red-500"
                : "border-[#0D9DFD1F] focus:border-[#0D9DFD] hover:border-[#0D9DFD]/50"
            }`}
          />
          {errors.newPassword && (
            <Typography className="!text-red-500 !text-xs !mt-1 !font-inter">
              {errors.newPassword.message}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography className="block text-sm lg:text-base mb-2 font-proxima font-medium text-white/80">
            {fields.confirmNewPassword || "Confirm New Password"}
          </Typography>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder={
              placeholders.confirmNewPassword || "Confirm your new password"
            }
            className={`appearance-none block w-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px] bg-[#0000004D] border-2 rounded-full ${
              errors.confirmPassword
                ? "border-red-500 focus:border-red-500"
                : "border-[#0D9DFD1F] focus:border-[#0D9DFD] hover:border-[#0D9DFD]/50"
            }`}
          />
          {errors.confirmPassword && (
            <Typography className="!text-red-500 !text-xs !mt-1 !font-inter">
              {errors.confirmPassword.message}
            </Typography>
          )}
        </Box>
      </Box>

      <Box className="pt-2 max-w-[220px] mx-auto lg:mx-0 lg:max-w-full">
        <GradientButton
          type="submit"
          disabled={changePasswordMutation.isPending || !isDirty}
        >
          {changePasswordMutation.isPending ? (
            <Box className="flex items-center justify-center gap-2">
              <Loading size={16} />
              <span>{buttons.updating || "Updating..."}</span>
            </Box>
          ) : (
            buttons.updatePassword || "Update Password"
          )}
        </GradientButton>
      </Box>
    </Box>
  );
};
