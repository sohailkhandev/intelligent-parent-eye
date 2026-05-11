import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MissionService } from "@services";
import { useAuthContext } from "@providers";

export const useGetMissions = () =>
  useQuery({
    queryKey: ["missions"],
    queryFn: MissionService.getMissions,
  });

export const useCollectMission = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuthContext();

  return useMutation({
    mutationFn: MissionService.collectMission,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["missions"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["markets"] }),
        queryClient.invalidateQueries({ queryKey: ["mainMarket"] }),
      ]);
      await refreshUser();
    },
  });
};
