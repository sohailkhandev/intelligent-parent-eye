import { AppsService } from "@services";
import { useMutation } from "@tanstack/react-query";

export const useGetChildApps = () =>
  useMutation({ mutationFn: AppsService.getChildApps });

export const useUpdateChildAppRestriction = () =>
  useMutation({ mutationFn: AppsService.updateChildAppRestriction });
