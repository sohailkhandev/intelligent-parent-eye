import { useMutation } from "@tanstack/react-query";
import { CustomerSupportService } from "@services";

export const useSendCustomerSupportMessage = () => {
  return useMutation({
    mutationFn: CustomerSupportService.sendCustomerSupportMessage,
  });
};
