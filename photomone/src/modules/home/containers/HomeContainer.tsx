import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HomeScreen } from "../screens/HomeScreen";
import { SlotApis, NoticeApis, MissionApis } from "@apis";
import { setMissionCompletedListener } from "@services";
import { useAppContext, useLanguage } from "@providers";

export type HomeContainerVariant = "dashboard" | "notice";

export interface HomeContainerProps {
  variant?: HomeContainerVariant;
}

export const HomeContainer = ({
  variant = "dashboard",
}: HomeContainerProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const collectSuccessText =
    t.home?.missionsTab?.labels?.collectSuccess ||
    "Mission reward collected successfully.";
  const { data: slotsData, isLoading } = SlotApis.useGetAllSlots();
  const slots = slotsData?.data?.slots ?? [];

  const { data: noticesData, isLoading: noticesLoading } =
    NoticeApis.useGetNotices();
  const notices = Array.isArray(noticesData?.data) ? noticesData.data : [];

  const {
    data: missionsData,
    isLoading: missionsLoading,
    isError: missionsIsError,
    error: missionsError,
  } = MissionApis.useGetMissions();
  const collectMutation = MissionApis.useCollectMission();

  useEffect(() => {
    const refetch = () => {
      void queryClient.invalidateQueries({ queryKey: ["missions"] });
    };
    setMissionCompletedListener(refetch);
    return () => setMissionCompletedListener(null);
  }, [queryClient]);

  const missions = missionsData?.data?.missions ?? [];

  const collectingMissionId =
    collectMutation.isPending &&
    typeof collectMutation.variables === "string"
      ? collectMutation.variables
      : null;

  return (
    <HomeScreen
      variant={variant}
      slots={slots}
      isLoading={isLoading}
      notices={notices}
      noticesLoading={noticesLoading}
      missions={missions}
      missionsLoading={missionsLoading}
      missionsIsError={missionsIsError}
      missionsError={missionsError}
      onCollectMission={(id) =>
        collectMutation.mutate(id, {
          onSuccess: () => showToast(collectSuccessText, "success"),
        })
      }
      collectingMissionId={collectingMissionId}
    />
  );
};

export default HomeContainer;
