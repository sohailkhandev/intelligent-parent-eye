import { SettingsService } from "@services";
import { useMutation } from "@tanstack/react-query";

export const useUpdateParentProfile = () =>
  useMutation({ mutationFn: SettingsService.updateParentProfile });
