import React, { useMemo, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainButton, OutlineButton } from "@components";
import { COLORS, ROUTES } from "@constants";
import { useAppContext, useLanguage } from "@providers";
import { prepareSuccessChime, playCrowdHoorayAndClap, translateMarketName } from "@utils";
import type { MarketEventPayload } from "@types";

const FIREWORKS_DURATION_MS = 9000;
const FADE_IN_MS = 480;
const AUTO_CLOSE_MS = 9000;

const FIREWORK_COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ff85a2",
  "#a78bfa",
  "#ffffff",
  "#ff9f43",
  "#00d2d3",
  "#fd79a8",
];

type FireworkParticle = {
  id: number;
  angle: number; // deg
  distance: number; // px
  color: string;
  size: number;
  duration: number;
  delay: number;
  fall: number; // extra downward drift (gravity) in px
};

type FireworkBurst = {
  id: number;
  left: number; // %
  top: number; // %
  delay: number; // s
  particles: FireworkParticle[];
};

function generateFireworkParticles(count: number): FireworkParticle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * 360;
    const distance = 72 + Math.random() * 100;
    return {
      id: i,
      angle,
      distance,
      color:
        FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      size: 2.8 + Math.random() * 3.8,
      /* Slightly varied length; linear + per-keyframe easing = fluid motion, not “slow”. */
      duration: 1.35 + Math.random() * 0.45,
      /* Tight stagger: one soft wave, not a scratchy cascade. */
      delay: Math.random() * 0.07,
      fall: 42 + Math.random() * 72,
    };
  });
}

function generateFireworks(count: number): FireworkBurst[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 14 + Math.random() * 72,
    top: 20 + Math.random() * 28,
    delay: i * 0.42 + Math.random() * 0.22,
    particles: generateFireworkParticles(20 + Math.floor(Math.random() * 10)),
  }));
}

interface MarketSaleSuccessPopupProps {
  open: boolean;
  onClose: () => void;
  payload: MarketEventPayload | null;
}

export const MarketSaleSuccessPopup = ({
  open,
  onClose,
  payload,
}: MarketSaleSuccessPopupProps) => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const socketT = translations?.result?.socket || {};
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworks = useMemo(() => generateFireworks(8), []);

  const imageUrl =
    payload?.imageUrl ?? payload?.exposureResult?.imageUrl ?? null;
  const earnedPoints =
    payload?.marketPoints ??
    payload?.earnedPoints ??
    payload?.purchasePoints ??
    payload?.exposureResult?.earnedPoints ??
    payload?.exposureResult?.purchasePoints ??
    0;

  const soldMarketRaw =
    payload?.marketName || payload?.exposureResult?.marketName || "";
  const soldMarketLabel = soldMarketRaw
    ? translateMarketName(soldMarketRaw, translations) || soldMarketRaw
    : "";
  const subtitleText = soldMarketLabel
    ? (socketT.photoSoldInMarket || "Your photo has been sold in {market}.").replace(
        "{market}",
        soldMarketLabel
      )
    : payload?.message || "";

  const earnedPointsTemplate =
    socketT.earnedPoints || "Earned points: {points}";
  const earnedParts = earnedPointsTemplate.split("{points}");

  useEffect(() => {
    if (!open) {
      setShowFireworks(false);
      return;
    }
    setShowFireworks(true);
    prepareSuccessChime();
    playCrowdHoorayAndClap();
    const t = setTimeout(() => setShowFireworks(false), FIREWORKS_DURATION_MS);
    const autoCloseTimer = setTimeout(() => onClose(), AUTO_CLOSE_MS);
    return () => {
      clearTimeout(t);
      clearTimeout(autoCloseTimer);
    };
  }, [open]);

  const handleCheckResult = () => {
    onClose();
    navigate(`${ROUTES.dashboard}/${ROUTES.result}`);
  };

  if (!open) return null;

  return (
    <Box
      className="fixed inset-0 flex flex-col items-center px-4"
      sx={{
        position: "relative",
        overflow: "hidden",
        zIndex: 100001,
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.primary} 100%)`,
        paddingBottom: "2em",
        justifyContent: "space-between",
      }}
    >
      {showFireworks && (
        <>
          <style>
            {`
              /*
                Per-keyframe animation-timing-function = smooth phase changes:
                0→52%: ease-out (spark blooms outward and eases into the arc peak)
                52→100%: ease-in (gravity-style fall, accelerates gently into fade)
                Overall animation uses linear so these segment curves are not doubled.
              */
              @keyframes fireworkBurst {
                0% {
                  transform: translate(-50%, -50%) translate(0, 0) scale(0.35);
                  opacity: 0;
                  animation-timing-function: cubic-bezier(0.22, 0.95, 0.36, 1);
                }
                10% {
                  opacity: 1;
                }
                52% {
                  transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(1);
                  opacity: 1;
                  animation-timing-function: cubic-bezier(0.45, 0.02, 0.55, 0.98);
                }
                100% {
                  transform: translate(-50%, -50%) translate(calc(var(--tx) * 1.03), calc(var(--ty) * 1.03 + var(--fall))) scale(0.14);
                  opacity: 0;
                }
              }
              /* Rocket: strong ease-out = quick liftoff, soft arrival (no extra long delay). */
              @keyframes fireworkRocket {
                0% {
                  transform: translate(-50%, 0) translateZ(0);
                  opacity: 0;
                  animation-timing-function: cubic-bezier(0.2, 0.85, 0.3, 1);
                }
                6% {
                  opacity: 1;
                }
                90% {
                  opacity: 1;
                  animation-timing-function: cubic-bezier(0.35, 0, 0.85, 0.95);
                }
                100% {
                  transform: translate(-50%, var(--rise)) translateZ(0);
                  opacity: 0;
                }
              }
              @keyframes fireworkRocketTrail {
                0% {
                  transform: translate(-50%, 0) scaleY(0.75) translateZ(0);
                  opacity: 0;
                  animation-timing-function: cubic-bezier(0.25, 0.8, 0.35, 1);
                }
                12% {
                  opacity: 0.7;
                }
                88% {
                  opacity: 0.45;
                  animation-timing-function: cubic-bezier(0.35, 0, 0.85, 0.95);
                }
                100% {
                  transform: translate(-50%, var(--rise)) scaleY(1) translateZ(0);
                  opacity: 0;
                }
              }
              /* Soft bloom: ease-out on expansion, gentle fade-out. */
              @keyframes fireworkFlash {
                0% {
                  transform: translate(-50%, -50%) scale(0.35) translateZ(0);
                  opacity: 0;
                  animation-timing-function: cubic-bezier(0.25, 0.9, 0.4, 1);
                }
                55% {
                  transform: translate(-50%, -50%) scale(1.25) translateZ(0);
                  opacity: 0.55;
                  animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
                }
                100% {
                  transform: translate(-50%, -50%) scale(1.85) translateZ(0);
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
            {fireworks.map((fw) => {
              const rocketDur = 0.58 + fw.delay * 0.08;
              const burstT = fw.delay + rocketDur * 0.9;
              return (
                <React.Fragment key={fw.id}>
                  {/* Rocket: bright head + long fading trail */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: `${fw.left}%`,
                      top: "100%",
                      width: 0,
                      height: 0,
                      pointerEvents: "none",
                    }}
                  >
                    <Box
                      sx={
                        {
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,220,100,0.9) 40%, rgba(255,180,50,0.6) 100%)",
                          boxShadow:
                            "0 0 12px rgba(255,220,150,0.9), 0 0 4px rgba(255,255,255,0.8)",
                          animation: `fireworkRocket ${rocketDur}s linear ${fw.delay}s forwards`,
                          "--rise": `calc(-1 * (100 - ${fw.top}) * 1vh)`,
                        } as React.CSSProperties
                      }
                    />
                    <Box
                      sx={
                        {
                          position: "absolute",
                          left: 0,
                          top: 8,
                          width: 2,
                          height: 140,
                          background:
                            "linear-gradient(to top, rgba(255,230,150,0.85) 0%, rgba(255,200,80,0.5) 25%, rgba(255,180,50,0.2) 60%, transparent 100%)",
                          borderRadius: 1,
                          boxShadow: "0 0 8px rgba(255,200,100,0.4)",
                          animation: `fireworkRocketTrail ${rocketDur}s linear ${fw.delay}s forwards`,
                          "--rise": `calc(-1 * (100 - ${fw.top}) * 1vh)`,
                        } as React.CSSProperties
                      }
                    />
                  </Box>
                  {/* Central flash on burst */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: `${fw.left}%`,
                      top: `${fw.top}%`,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,240,200,0.6) 50%, transparent 70%)",
                      boxShadow:
                        "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,220,150,0.4)",
                      animation: `fireworkFlash 0.55s linear ${burstT}s forwards`,
                      pointerEvents: "none",
                    }}
                  />
                  {/* Burst particles with gravity */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: `${fw.left}%`,
                      top: `${fw.top}%`,
                      width: 0,
                      height: 0,
                      pointerEvents: "none",
                    }}
                  >
                    {fw.particles.map((p) => {
                      const rad = (p.angle * Math.PI) / 180;
                      const tx = Math.cos(rad) * p.distance;
                      const ty = Math.sin(rad) * p.distance;
                      return (
                        <Box
                          key={p.id}
                          sx={
                            {
                              position: "absolute",
                              left: 0,
                              top: 0,
                              width: p.size,
                              height: p.size,
                              borderRadius: "50%",
                              backgroundColor: p.color,
                              boxShadow: `0 0 ${p.size * 1.6}px ${p.color}99, 0 0 ${p.size * 3}px ${p.color}55`,
                              willChange: "transform, opacity",
                              animation: `fireworkBurst ${p.duration}s linear ${burstT + p.delay}s forwards`,
                              "--tx": `${tx}px`,
                              "--ty": `${ty}px`,
                              "--fall": `${p.fall}px`,
                            } as React.CSSProperties
                          }
                        />
                      );
                    })}
                  </Box>
                </React.Fragment>
              );
            })}
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
          @keyframes contentFadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px) scale(0.985);
              animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes contentFadeIn {
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
          animation: `contentFadeIn ${FADE_IN_MS}ms linear forwards`,
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
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
          }}
        >
          {socketT.photoSoldCongratulations || "Congratulations"}
        </Typography>

        {subtitleText ? (
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.95)",
              textAlign: "center",
              maxWidth: 320,
            }}
          >
            {subtitleText}
          </Typography>
        ) : null}

        <Box
          sx={{
            width: "50vmin",
            height: "50vmin",
            maxWidth: 250,
            position: "relative",
            maxHeight: 250,
            border: `4px solid ${COLORS.primary}`,
            borderRadius: 2,
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={socketT.soldPhotoAlt || "Sold photo"}
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
            {socketT.photoSoldBadge || "Photo sold"}
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
            {earnedParts[0]}
            <Box component="span" className="font-bold">
              {earnedPoints}
            </Box>
            {earnedParts[1] ?? ""}
          </Typography>
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
          animation: `contentFadeIn ${FADE_IN_MS}ms linear forwards`,
          animationDelay: "60ms",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        <Box className="flex flex-col items-center gap-3">
          <MainButton
            onClick={handleCheckResult}
            className="!min-w-[200px] !rounded-full !text-base hover:!text-white hover:!border-white"
            color={COLORS.secondary}
          >
            {socketT.checkResult || "Check result"}
          </MainButton>
          <OutlineButton
            onClick={onClose}
            className="!min-w-[200px] !rounded-full !py-2 !text-base"
          >
            {socketT.cancel || "Cancel"}
          </OutlineButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MarketSaleSuccessPopup;

/** Global version that reads open/payload/onClose from AppContext (for socket photoSold). */
export const MarketSaleSuccessPopupGlobal = () => {
  const { marketSaleSuccessPopup } = useAppContext();
  return (
    <MarketSaleSuccessPopup
      open={marketSaleSuccessPopup.open}
      onClose={marketSaleSuccessPopup.hide}
      payload={marketSaleSuccessPopup.payload}
    />
  );
};
