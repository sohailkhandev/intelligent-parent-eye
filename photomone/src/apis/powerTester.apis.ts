import { useMutation } from "@tanstack/react-query";
import { PowerTesterService } from "@services";

export const useSubmitPowerTesterApplication = () => {
  return useMutation({
    mutationFn: PowerTesterService.submitPowerTesterApplication,
  });
};
