import React, { useEffect, useMemo, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { MainButton } from "@components";
import { MissionsIcon, PointsIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import { useAppContext, useLanguage } from "@providers";
import { useQueryClient } from "@tanstack/react-query";
import { MissionApis } from "@apis";
import trophyImg from "@assets/images/trophy.png";
import {
  prepareSuccessChime,
  playCrowdHoorayAndClap,
  playSuccessChime,
} from "@utils";
import type { MissionCompletedSocketPayload } from "@types";

const CONFETTI_COLORS = [
  COLORS.secondary,
  COLORS.primary,
  "#FFD93D",
  "#A78BFA",
  "#6BCB77",
  "#FF9F43",
];

const BODY_MARK_MISSION = "[[MISSION]]";
const BODY_MARK_POINTS = "[[POINTS]]";

function renderTemplatedBody(
  template: string | undefined,
  missionEl: ReactNode,
  pointsEl: ReactNode
): ReactNode {
  const fallback = `You have completed ${BODY_MARK_MISSION} and earned ${BODY_MARK_POINTS}.`;
  const t =
    template &&
    template.includes(BODY_MARK_MISSION) &&
    template.includes(BODY_MARK_POINTS)
      ? template
      : fallback;
  const parts = t.split(BODY_MARK_MISSION);
  if (parts.length < 2) {
    return (
      <>
        You have completed {missionEl} and earned {pointsEl}.
      </>
    );
  }
  const [beforeMission, afterMissionRaw] = parts;
  const ptParts = afterMissionRaw.split(BODY_MARK_POINTS);
  if (ptParts.length < 2) {
    return (
      <>
        {beforeMission}
        {missionEl}
        {afterMissionRaw}
      </>
    );
  }
  const [between, afterPoints] = ptParts;
  return (
    <>
      {beforeMission}
      {missionEl}
      {between}
      {pointsEl}
      {afterPoints}
    </>
  );
}

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
};

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.35,
    duration: 2.2 + Math.random() * 1.2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));
}

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke={COLORS.grayStrong}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

interface MissionCompletedDialogProps {
  open: boolean;
  onClose: () => void;
  payload: MissionCompletedSocketPayload | null;
}

export const MissionCompletedDialog = ({
  open,
  onClose,
  payload,
}: MissionCompletedDialogProps) => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const { translations } = useLanguage();
  const t = translations || {};
  const home = t.home || {};
  const missionsTab = home.missionsTab || {};
  const labels = missionsTab.labels || {};
  const nameMap = missionsTab.nameMap || {};
  const completedDialog = missionsTab.completedDialog || {};
  const collectMutation = MissionApis.useCollectMission();

  const translateMissionName = (name?: string) =>
    (name && (nameMap[name] || nameMap[name.trim()])) || name || "";

  const pointsLabel =
    completedDialog.pointsLabel || labels.points || "Points";
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const confetti = useMemo(
    () => generateConfetti(reduceMotion ? 0 : 32),
    [reduceMotion]
  );

  useEffect(() => {
    if (!open) return;
    prepareSuccessChime();
    playCrowdHoorayAndClap();
    playSuccessChime();
  }, [open]);

  const handleCollectClick = () => {
    const missionId = payload?.missionId || payload?._id;
    const collectSuccessText =
      labels.collectSuccess || "Mission reward collected successfully.";
    if (!missionId) {
      showToast(
        completedDialog.collectInfoToast ||
          "Visit the Missions tab to collect your reward.",
        "info"
      );
      onClose();
      return;
    }
    collectMutation.mutate(missionId, {
      onSuccess: () => {
        showToast(collectSuccessText, "success");
        void queryClient.invalidateQueries({ queryKey: ["missions"] });
        void queryClient.invalidateQueries({ queryKey: ["authUser"] });
        onClose();
      },
      onError: (error: { message?: string }) => {
        showToast(
          error?.message ||
            completedDialog.collectInfoToast ||
            "Visit the Missions tab to collect your reward.",
          "error"
        );
      },
    });
  };

  const collectButtonText = collectMutation.isPending
    ? labels.collecting || "Collecting"
    : completedDialog.collectButton || "Collect Your Reward";

  const handleDialogCloseButton = () => {
    if (collectMutation.isPending) return;
    onClose();
  };

  /** Only dismiss via Collect or the header close control — not backdrop or Escape. */
  const handleDialogClose: NonNullable<
    React.ComponentProps<typeof Dialog>["onClose"]
  > = (_event, reason) => {
    if (
      reason === "backdropClick" ||
      reason === "escapeKeyDown" ||
      collectMutation.isPending
    )
      return;
    onClose();
  };

  if (!payload) return null;

  const missionNameRaw = payload.missionName;
  const translatedMissionName = translateMissionName(missionNameRaw);
  const points = payload.points;

  const missionNameEl = (
    <Box
      component="span"
      sx={{ fontWeight: 700, color: COLORS.generalText }}
    >
      {translatedMissionName}
    </Box>
  );
  const pointsEl = (
    <Box component="span" sx={{ fontWeight: 700, color: COLORS.primary }}>
      {points} {pointsLabel}
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 10000 }}
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(38, 38, 44, 0.55)" } },
      }}
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          background: COLORS.white,
          maxWidth: "420px",
          m: 2,
        },
      }}
    >
      <IconButton
        onClick={handleDialogCloseButton}
        aria-label={completedDialog.closeAriaLabel || "Close"}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 5,
          color: COLORS.grayStrong,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pt: 3, pb: 3, px: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            minHeight: 120,
          }}
        >
          {!reduceMotion && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 0,
              }}
            >
              <AnimatePresence>
                {open &&
                  confetti.map((c) => (
                    <motion.span
                      key={c.id}
                      initial={{
                        top: "-8%",
                        left: `${c.left}%`,
                        opacity: 1,
                        rotate: 0,
                      }}
                      animate={{
                        top: "108%",
                        opacity: [1, 1, 0],
                        rotate: c.rotate,
                      }}
                      transition={{
                        duration: c.duration,
                        delay: c.delay,
                        ease: "easeIn",
                      }}
                      style={{
                        position: "absolute",
                        width: c.size,
                        height: c.size * 0.45,
                        borderRadius: 2,
                        backgroundColor: c.color,
                        boxShadow: `0 0 6px ${c.color}88`,
                      }}
                    />
                  ))}
              </AnimatePresence>
            </Box>
          )}

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.25,
                mb: 2,
              }}
            >
              <MissionsIcon color={COLORS.secondary} />
              <Typography
                component="h2"
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: COLORS.generalText,
                  letterSpacing: "0.02em",
                }}
              >
                {completedDialog.title || "Mission Completed"}
              </Typography>
            </Box>

            <Box sx={{ position: "relative", mb: 2 }}>
              {/* {payload.url ? (
                <Box
                  component="img"
                  src={payload.url}
                  alt=""
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 44,
                    height: 44,
                    objectFit: "contain",
                    borderRadius: "12px",
                    border: `2px solid ${COLORS.white}`,
                    boxShadow: 2,
                    zIndex: 2,
                  }}
                />
              ) : null} */}
              <motion.div
                initial={reduceMotion ? false : { scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <Box
                  component="img"
                  src={trophyImg}
                  alt=""
                  sx={{
                    width: { xs: 140, sm: 160 },
                    height: "auto",
                    display: "block",
                    mx: "auto",
                    filter: "drop-shadow(0 8px 24px rgba(250, 148, 157, 0.35))",
                  }}
                />
              </motion.div>
            </Box>

            <Typography className="font-semibold text-2xl mb-6">
              {completedDialog.congratulations || "Congratulations!"}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.9375rem",
                color: COLORS.grayStrong,
                lineHeight: 1.55,
                maxWidth: 340,
                mb: 2,
              }}
            >
              {renderTemplatedBody(
                completedDialog.bodyTemplate,
                missionNameEl,
                pointsEl
              )}
            </Typography>

            <Box className="flex items-center gap-1 mb-2.5">
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
                {points} {pointsLabel}
              </Typography>
            </Box>

            <MainButton
              onClick={handleCollectClick}
              disabled={collectMutation.isPending}
              className="!w-full !rounded-full !py-2.5"
            >
              {collectButtonText}
            </MainButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const MissionCompletedDialogGlobal = () => {
  const { missionCompletedDialog } = useAppContext();
  return (
    <MissionCompletedDialog
      open={missionCompletedDialog.open && !!missionCompletedDialog.payload}
      onClose={missionCompletedDialog.hide}
      payload={missionCompletedDialog.payload}
    />
  );
};

export default MissionCompletedDialog;
