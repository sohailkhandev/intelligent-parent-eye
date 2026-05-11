import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@services";

export const useCompleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.completeProfile,
    onSuccess: () => {
      // Invalidate notifications to refresh after profile completion
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: UserService.updateProfile,
  });

export const useUploadProfilePicture = () =>
  useMutation({
    mutationFn: UserService.uploadProfilePicture,
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: UserService.changePassword,
  });

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.deleteAccount,
    onSuccess: () => {
      // Clear all queries since the account is being deleted
      queryClient.clear();
    },
  });
};

