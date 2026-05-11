import { AlertsService } from "@services";
import { useQuery } from "@tanstack/react-query";

export const useGetAlerts = () =>
  useQuery({
    queryKey: ["alerts"],
    queryFn: () => AlertsService.getAlerts(),
  });
