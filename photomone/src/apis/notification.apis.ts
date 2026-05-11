import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "@services";

export const useGetNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationService.getNotifications,
  });

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => NotificationService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

