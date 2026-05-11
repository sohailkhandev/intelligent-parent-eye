import { useMutation } from "@tanstack/react-query";
import { ChatbotService } from "@services";

export const useSendChatbotMessage = () => {
  return useMutation({
    mutationFn: (message: string) => ChatbotService.sendChatbotMessage(message),
  });
};
