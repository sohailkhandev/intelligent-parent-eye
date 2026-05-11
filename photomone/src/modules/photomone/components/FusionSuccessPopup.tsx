import React, { useMemo, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainButton, OutlineButton } from "@components";
import { COLORS, ROUTES } from "@constants";
import { useLanguage } from "@providers";

const SCORE_ANIMATION_DURATION_MS = 1300;
const CARD_ZOOM_MS = 640;
const CONFETTI_DURATION_MS = 9000;
const DELAY_BEFORE_SCORE_MS = 500;
const DELAY_BEFORE_CONGRATS_MS = 4000;
const DELAY_BEFORE_BUTTONS_MS = DELAY_BEFORE_SCORE_MS + CONFETTI_DURATION_MS;

/** Softer landing than cubic — score feels less “tick-y”. */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const CONFETTI_COLORS = [
  "#ffb3ba",
  "#ffdfba",
  "#ffffba",
  "#baffc9",
  "#bae1ff",
  "#e0bbe4",
  "#ff9a8b",
  "#fad0c4",
  "#a1c4fd",
  "#d4fc79",
  "#fff6b7",
  "#ffffff",
];

type ConfettiPiece = {
  id: number;
  left: number;
  width: number;
  height: number;
  color: string;
  delay: number;
  duration: number;
  rotateStart: number;
  rotateEnd: number;
  driftX: number;
  opacity: number;
};

function generateConfettiPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const isStrip = Math.random() > 0.45;

    return {
      id: i,
      left: Math.random() * 100,
      width: isStrip ? 4 + Math.random() * 4 : 8 + Math.random() * 10,
      height: isStrip ? 14 + Math.random() * 18 : 6 + Math.random() * 8,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      /* Tighter stagger = one cohesive shower, not a long jittery stream. */
      delay: Math.random() * 1.0,
      /* Single smooth fall per piece (paired with `forwards`, not `infinite`). */
      duration: 2.8 + Math.random() * 1.6,
      rotateStart: Math.random() * 360,
      rotateEnd: 360 + Math.random() * 720,
      driftX: -120 + Math.random() * 240,
      opacity: 0.6 + Math.random() * 0.2,
    };
  });
}

interface FusionSuccessPopupProps {
  open: boolean;
  onClose: () => void;
  visitGalleryText?: string;
  imageUrl?: string | null;
  score?: number;
  fusionNumber?: number;
}

export const FusionSuccessPopup = ({
  open,
  onClose,
  visitGalleryText,
  imageUrl,
  score: scoreProp = 100,
  fusionNumber,
}: FusionSuccessPopupProps) => {
  const { translations } = useLanguage();
  const pf = translations?.photomone?.photoFusion ?? {};
  const navigate = useNavigate();
  const congratulationsText = pf.congratulations ?? "Congratulations";
  const fusionCompletedLine = (
    pf.fusionCompletedLine ?? "Fusion {n} Completed"
  ).replace(/\{n\}/g, String(typeof fusionNumber === "number" ? fusionNumber : ""));
  const newScoreLabel = pf.newScoreLabel ?? "New Score:";
  const cancelLabel = pf.cancel ?? "Cancel";
  const altFusion = pf.altFusionSuccess ?? "Fusion success";
  const visitLabel = visitGalleryText ?? pf.visitGallery ?? "Visit gallery";
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [displayedScore, setDisplayedScore] = useState(0);
  const confettiPieces = useMemo(() => generateConfettiPieces(110), []);

  useEffect(() => {
    if (!open) {
      setShowScore(false);
      setShowCongratulations(false);
      setShowConfetti(false);
      setShowButtons(false);
      return;
    }
    // Score and confetti start together
    const t1 = setTimeout(() => {
      setShowScore(true);
      setShowConfetti(true);
    }, DELAY_BEFORE_SCORE_MS);
    const t2 = setTimeout(
      () => setShowCongratulations(true),
      DELAY_BEFORE_CONGRATS_MS
    );
    const t3 = setTimeout(() => setShowButtons(true), DELAY_BEFORE_BUTTONS_MS);
    const t4 = setTimeout(
      () => setShowConfetti(false),
      DELAY_BEFORE_SCORE_MS + CONFETTI_DURATION_MS
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [open]);

  // Smooth score count-up: starts when showScore becomes true
  useEffect(() => {
    if (!showScore || scoreProp == null) {
      setDisplayedScore(0);
      return;
    }
    const target = Math.round(scoreProp);
    setDisplayedScore(0);
    const durationMs = SCORE_ANIMATION_DURATION_MS;
    let startTime: number | null = null;
    let rafId: number;

    const animate = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutQuart(progress);
      const value = Math.min(target, Math.round(eased * target));
      setDisplayedScore(value);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayedScore(target);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [showScore, scoreProp]);

  const handleVisitGallery = () => {
    onClose();
    navigate(`${ROUTES.dashboard}`);
  };

  if (!open) return null;

  return (
    <Box
      className="flex flex-col items-center px-4"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 10050,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.primary} 100%)`,
        paddingBottom: "2em",
        justifyContent: "space-between",
      }}
    >
      {showConfetti && (
        <>
          <style>
            {`
              /*
                Only start + end transforms (plus a short opacity-only beat).
                Y moves monotonically down with linear time → no mid-air “hover”.
                Drift and spin interpolate in one straight segment (same progress).
              */
              @keyframes confettiFall {
                0% {
                  transform: translate3d(0, -60vh, 0) rotate(var(--rotate-start));
                  opacity: var(--opacity);
                }
                100% {
                  transform: translate3d(var(--drift-x), 120vh, 0)
                    rotate(var(--rotate-end));
                  opacity: 0;
                }
              }
            `}
          </style>

          <Box
            className="absolute inset-0 pointer-events-none"
            sx={{
              zIndex: 3,
              overflow: "hidden",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
          >
            {confettiPieces.map((p) => (
              <Box
                key={p.id}
                sx={
                  {
                    position: "absolute",
                    left: `${p.left}%`,
                    top: 0,
                    width: p.width,
                    height: p.height,
                    backgroundColor: p.color,
                    borderRadius: "2px",
                    opacity: 0,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    willChange: "transform, opacity",
                    transform: "translate3d(0, -60vh, 0)",
                    /* Linear: constant progress — no ease-out “stall” in the middle. */
                    animation: `confettiFall ${p.duration}s linear ${p.delay}s forwards`,
                    "--drift-x": `${p.driftX}px`,
                    "--rotate-start": `${p.rotateStart}deg`,
                    "--rotate-end": `${p.rotateEnd}deg`,
                    "--opacity": `${p.opacity}`,
                  } as React.CSSProperties
                }
              />
            ))}
          </Box>
        </>
      )}

      <Box
        className="absolute inset-0 pointer-events-none"
        sx={{
          background: `linear-gradient(135deg, ${COLORS.primary}40 0%, ${COLORS.secondary}50 50%, ${COLORS.primary}30 100%)`,
          filter: "blur(40px)",
          WebkitFilter: "blur(40px)",
        }}
      />

      <style>
        {`
          @keyframes fusionCardZoom {
            0% {
              transform: scale(1.08) translateY(14px);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
            }
            100% {
              transform: scale(1) translateY(0);
              opacity: 1;
            }
          }
          @keyframes buttonsZoomFadeIn {
            0% {
              transform: scale(1.04) translateY(12px);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
            }
            100% {
              transform: scale(1) translateY(0);
              opacity: 1;
            }
          }
          @keyframes congratulationsFadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
              animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes fusionCardZoom {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes buttonsZoomFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes congratulationsFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          }
        `}
      </style>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        <Box
          sx={{
            minHeight: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              letterSpacing: "0.02em",
              opacity: showCongratulations ? 1 : 0,
              animation: showCongratulations
                ? "congratulationsFadeIn 0.55s linear forwards"
                : "none",
            }}
          >
            {congratulationsText}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "50vmin",
            height: "50vmin",
            maxWidth: 250,
            position: "relative",
            maxHeight: 250,
            border: `4px solid ${COLORS.primary}`,
            borderRadius: 2,
            transformOrigin: "center center",
            animation: `fusionCardZoom ${CARD_ZOOM_MS}ms linear forwards`,
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={altFusion}
              sx={{
                borderRadius: 1.6,
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                borderRadius: 1.6,
                width: "100%",
                height: "100%",
                display: "block",
                bgcolor: "action.hover",
              }}
            />
          )}
          <Box
            sx={{
              position: "absolute",
              backgroundColor: COLORS.primary,
              left: "50%",
              bottom: "-14px",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              fontSize: "0.8em",
              fontWeight: 500,
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              color: "white",
            }}
          >
            {fusionCompletedLine}
          </Box>
        </Box>
        <Box
          className="mt-6"
          sx={{
            minHeight: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          {showScore && (
            <Typography
              component="span"
              sx={{
                fontSize: "1.25em",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {newScoreLabel}{" "}
              <span className="font-bold">{displayedScore}</span>
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          minHeight: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {showButtons && (
          <Box
            className="flex flex-col items-center gap-3"
            sx={{
              animation: "buttonsZoomFadeIn 0.55s linear forwards",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
          >
            <MainButton
              onClick={handleVisitGallery}
              className="!min-w-[200px] !rounded-full !text-base hover:!text-white hover:!border-white"
              color={COLORS.secondary}
            >
              {visitLabel}
            </MainButton>
            <OutlineButton
              onClick={onClose}
              className="!min-w-[200px] !rounded-full !py-2 !text-base"
            >
              {cancelLabel}
            </OutlineButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FusionSuccessPopup;
