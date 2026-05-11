import { Box, Typography } from "@mui/material";
import { MainButton, Loading } from "@components";
import { PointsIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import { useLanguage } from "@providers";
import type { Mission } from "@types";

const CARD_RADIUS = "14px";

function missionCardBorderColor(status: Mission["status"]) {
  if (status === "incompleted") return COLORS.border;
  return COLORS.secondary;
}

export interface MissionsTabScreenProps {
  missions: Mission[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onCollectMission: (missionId: string) => void;
  collectingMissionId: string | null;
}

export const MissionsTabScreen = ({
  missions,
  isLoading,
  isError,
  error,
  onCollectMission,
  collectingMissionId,
}: MissionsTabScreenProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const home = t.home || {};
  const missionsTab = home.missionsTab || {};
  const labels = missionsTab.labels || {};
  const nameMap = missionsTab.nameMap || {};
  const descriptionMap = missionsTab.descriptionMap || {};

  const translateMissionName = (name?: string) =>
    (name && (nameMap[name] || nameMap[name.trim()])) || name || "Mission Name";
  const translateMissionDescription = (description?: string) =>
    (description &&
      (descriptionMap[description] || descriptionMap[description.trim()])) ||
    description ||
    "";

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-16">
        <Loading size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="py-8 px-2">
        <Typography className="text-sm" sx={{ color: COLORS.grayStrong }}>
          {error instanceof Error
            ? error.message
            : labels.failedToLoad || "Failed to load missions."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-3 pb-4 px-0 sm:px-1">
      {missions.map((mission) => (
        <MissionCard
          key={mission._id}
          mission={mission}
          labels={labels}
          translatedName={translateMissionName(mission.missionName)}
          translatedDescription={translateMissionDescription(mission.description)}
          isCollecting={collectingMissionId === mission._id}
          onCollect={() => onCollectMission(mission._id)}
        />
      ))}
    </Box>
  );
};

function MissionCard({
  mission,
  labels,
  translatedName,
  translatedDescription,
  onCollect,
  isCollecting,
}: {
  mission: Mission;
  labels: Record<string, string>;
  translatedName: string;
  translatedDescription: string;
  onCollect: () => void;
  isCollecting: boolean;
}) {
  const { status } = mission;
  const isCompleted = status === "completed";
  const isCollected = status === "collected";

  const collectDisabled = !isCompleted || isCollecting;
  const buttonLabel = isCollected
    ? labels.collected || "Collected"
    : !isCompleted
      ? labels.incomplete || "Incomplete"
      : labels.collect || "Collect";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 2, sm: 3 },
        p: 2,
        backgroundColor: COLORS.white,
        borderRadius: CARD_RADIUS,
        border: `1px solid ${missionCardBorderColor(status)}`,
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 1.5,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box
          className="overflow-hidden"
          sx={{
            width: { xs: 35, sm: 58 },
            height: { xs: 35, sm: 58 },
            backgroundColor: COLORS.white,
          }}
        >
          <Box
            component="img"
            src={mission.url}
            alt=""
            className="w-full object-contain"
          />
        </Box>

        <Box className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <Typography className="font-semibold text-base lg:text-lg">
            {translatedName}
          </Typography>
          <Typography
            className="text-[0.9em] font-medium leading-snug"
            sx={{ color: COLORS.grayStrong }}
          >
            {translatedDescription}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          flexShrink: 0,
          width: { xs: "100%", sm: "auto" },
          pl: { xs: 0, sm: 0.5 },
        }}
      >
        <Box
          className="flex items-center gap-1"
          sx={{
            justifyContent: { xs: "center", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Box
            sx={{
              color: COLORS.primary,
              display: "flex",
              alignItems: "center",
              lineHeight: 0,
            }}
          >
            <PointsIcon />
          </Box>
          <Typography
            className="text-xs sm:text-sm font-semibold whitespace-nowrap"
            sx={{ color: COLORS.generalText }}
          >
            {mission.points} {labels.points || "Points"}
          </Typography>
        </Box>
        <MainButton
          disabled={collectDisabled || isCollected}
          onClick={() => onCollect()}
          className="w-full sm:!w-auto sm:!min-w-[120px]"
        >
          {isCollecting && isCompleted
            ? labels.collecting || "Collecting"
            : buttonLabel}
        </MainButton>
      </Box>
    </Box>
  );
}

export default MissionsTabScreen;
