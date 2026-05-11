import { Box, Typography, IconButton } from "@mui/material";
import { Share, Lock } from "@mui/icons-material";
import { MainDialog, Loading } from "@components";
import type { Slot, SlotDetailsResponse } from "@types";
import { PreviewPosterDialog } from "./PreviewPosterDialog";
import { RevealPointsDialog } from "./RevealPointsDialog";
import { ClaimPointsWarningDialog } from "./ClaimPointsWarningDialog";
import { useState } from "react";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";

const SLIDER_BLUE = "#29C4D6";
const CARD_BORDER = "#E8E8E8";
const PETRIFIED_ORANGE = "#F9A602";

interface SlotDetailDialogProps {
  open: boolean;
  onClose: () => void;
  slot: Slot | null;
  slotDetailsData?: SlotDetailsResponse | null;
  isLoading?: boolean;
}

export const SlotDetailDialog = ({
  open,
  onClose,
  slot,
  slotDetailsData,
  isLoading = false,
}: SlotDetailDialogProps) => {
  const { translations } = useLanguage();
  // const { showToast } = useAppContext();
  const slotT = translations?.slotDetail;
  const [previewPosterOpen, setPreviewPosterOpen] = useState(false);
  const [showRevealPointsDialog, setShowRevealPointsDialog] = useState(false);
  const [showClaimWarningDialog, setShowClaimWarningDialog] = useState(false);
  const isPetrified = slot?.isPetrified === true;

  const getTranslatedRankLabel = (raw: string | null | undefined) => {
    if (raw == null || String(raw).trim() === "") return raw;
    const rankLabels = slotT?.rankLabels as Record<string, string> | undefined;
    return rankLabels?.[raw] ?? raw;
  };

  const handleShare = () => {
    if (!slotDetailsData?.data?.imageUrl) return;
    setPreviewPosterOpen(true);
  };

  return (
    <>
      <MainDialog
        open={open}
        onClose={onClose}
        title={slotT?.title ?? "Photo Details"}
        maxWidth="md"
      >
        <Box
          className="flex flex-col justify-center h-full"
          sx={{
            overflowY: { xs: "auto", md: "hidden" },
            overflowX: "hidden",
          }}
        >
          {isLoading ? (
            <Box className="flex items-center justify-center py-16">
              <Loading size={48} />
            </Box>
          ) : (
            <>
              {/* Main Content Grid - New UI: left photo, right cards */}
              <Box
                className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-6"
                sx={{
                  px: 2,
                  py: 1,
                  ...(isPetrified && {
                    filter: "grayscale(0.35)",
                    opacity: 0.92,
                  }),
                }}
              >
                {/* Left Column - Photo with cyan border and share */}
                <Box className="flex flex-col items-center md:items-start justify-center">
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: "100%", md: 200 },
                      maxWidth: 200,
                      aspectRatio: "1",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: `3px solid ${isPetrified ? PETRIFIED_ORANGE : (slotDetailsData?.data.styles?.color ?? SLIDER_BLUE)}`,
                      mx: { xs: "auto", md: 0 },
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* Share - white circle, top-right (hidden when petrified) */}
                    {!isPetrified &&
                      slotDetailsData?.data.rankLabel != null &&
                      String(slotDetailsData.data.rankLabel).trim() !== "" && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                          }}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 10,
                            color: COLORS.generalText,
                            backgroundColor: COLORS.white,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                            border: `1px solid ${CARD_BORDER}`,
                            "&:hover": {
                              backgroundColor: "#F5F5F5",
                            },
                            "&.Mui-disabled": {
                              backgroundColor: COLORS.white,
                              color: COLORS.generalText,
                            },
                          }}
                        >
                          <Share fontSize="small" />
                        </IconButton>
                      )}

                    <Box
                      component="img"
                      src={slotDetailsData?.data.imageUrl}
                      className="w-full h-full object-cover"
                      sx={{ position: "relative", zIndex: 0 }}
                    />
                  </Box>
                </Box>

                {/* Right Column - Three card panels */}
                <Box className="flex flex-col justify-center gap-2">
                  {/* Card 1: Score */}
                  <Box
                    sx={{
                      borderRadius: "10px",
                      border: `1px solid ${CARD_BORDER}`,
                      py: 0.5,
                      px: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: COLORS.generalText,
                          fontWeight: 500,
                        }}
                      >
                        {slotT?.score ?? "Score:"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "#F9A602",
                        }}
                      >
                        {slotDetailsData?.data.score ?? "0"}
                      </Typography>
                    </Box>
                    {(slotDetailsData?.data.rankValue == null ||
                      slotDetailsData?.data.rankValue === undefined) && (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: COLORS.grayStrong,
                          mt: 0.5,
                        }}
                      >
                        {slotT?.sellMoreToRank ??
                          "Unranked! Sell more to appear in rankings"}
                      </Typography>
                    )}
                  </Box>

                  {/* Card 2: Distinguished % + Trustworthiness slider */}
                  <Box
                    sx={{
                      borderRadius: "10px",
                      border: `1px solid ${CARD_BORDER}`,
                      py: 0.5,
                      px: 2,
                    }}
                  >
                    {slotDetailsData?.data.rankLabel != null &&
                      String(slotDetailsData.data.rankLabel).trim() !== "" && (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: COLORS.generalText,
                            mb: 1.5,
                          }}
                        >
                          {getTranslatedRankLabel(
                            slotDetailsData.data.rankLabel
                          )}{" "}
                        </Typography>
                      )}

                    {/* Numeric markers above slider */}
                    <Box sx={{ position: "relative", height: 20 }}>
                      {[10, 50, 100, 200, 500].map((marker) => {
                        const position = (marker / 500) * 100;
                        const isLow = marker <= 100;
                        return (
                          <Box
                            key={marker}
                            sx={{
                              position: "absolute",
                              left: `${position}%`,
                              transform: "translateX(-50%)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: isLow
                                  ? COLORS.secondary
                                  : COLORS.primary,
                              }}
                            >
                              {marker}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 12,
                        borderRadius: 8,
                        backgroundColor: "#E0E0E0",
                        overflow: "hidden",
                      }}
                    >
                      {(() => {
                        const score = Number(slotDetailsData?.data?.score) || 0;
                        const maxScale = Math.max(score, 500);
                        const fillPercent = Math.min(
                          100,
                          (score / maxScale) * 100
                        );
                        return (
                          score > 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: `${fillPercent}%`,
                                borderRadius: 1,
                                backgroundColor: SLIDER_BLUE,
                                transition: "width 0.3s ease",
                              }}
                            />
                          )
                        );
                      })()}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 0.2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          color: COLORS.secondary,
                        }}
                      >
                        {slotT?.unreliable ?? "Unreliable"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          color: COLORS.primary,
                        }}
                      >
                        {slotT?.trustworthy ?? "Trustworthy"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Card 3: Earnings */}
                  <Box
                    sx={{
                      borderRadius: "10px",
                      border: `1px solid ${CARD_BORDER}`,
                      py: 0.5,
                      px: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: COLORS.generalText,
                          fontWeight: 500,
                        }}
                      >
                        {slotT?.earnings ?? "Earnings"}
                      </Typography>
                      {slotDetailsData?.data.totalPoints == null ? (
                        <IconButton
                          onClick={() => setShowRevealPointsDialog(true)}
                          size="small"
                          sx={{
                            color: COLORS.grayStrong,
                            "&:hover": {
                              color: COLORS.generalText,
                              backgroundColor: "rgba(0,0,0,0.04)",
                            },
                          }}
                        >
                          <Lock sx={{ fontSize: 22 }} />
                        </IconButton>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: isPetrified ? COLORS.grayStrong : "#F9A602",
                          }}
                        >
                          {`$${slotDetailsData.data.totalPoints / 10}`}
                        </Typography>
                      )}
                    </Box>
                    {slotDetailsData?.data.totalPoints != null &&
                      (isPetrified ? (
                        <Typography
                          sx={{
                            mt: 1,
                            pt: 0.5,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: COLORS.grayStrong,
                            textAlign: "center",
                          }}
                        >
                          {slotT?.claimed ?? "Claimed"}
                        </Typography>
                      ) : (
                        <Box
                          component="button"
                          type="button"
                          onClick={() => setShowClaimWarningDialog(true)}
                          sx={{
                            mt: 1,
                            pt: 0.5,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            "&:hover": { opacity: 0.85 },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: COLORS.primary,
                            }}
                          >
                            {slotT?.claim ?? "Claim"}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </MainDialog>

      <RevealPointsDialog
        open={showRevealPointsDialog}
        onClose={() => setShowRevealPointsDialog(false)}
        slotId={slot?._id ?? null}
        onRevealSuccess={() => setShowClaimWarningDialog(true)}
        title={slotT?.revealPointsTitle ?? "Reveal Points"}
        message={slotT?.revealPointsMessage ?? "Are you sure?"}
        lockySubtext={slotT?.revealPointsLockySubtext ?? "Use 1 Locky"}
        cancelLabel={slotT?.cancelButton ?? "Cancel"}
        revealLabel={slotT?.revealButton ?? "Reveal"}
      />

      <ClaimPointsWarningDialog
        open={showClaimWarningDialog}
        onClose={() => setShowClaimWarningDialog(false)}
        slotId={slot?._id ?? null}
        pointsToClaim={slotDetailsData?.data.totalPoints ?? null}
        title={slotT?.claimWarningTitle ?? "Claim Points"}
        message={
          slotT?.claimWarningMessage ??
          "Claiming permanently deactivates this slot. Continue?"
        }
        pointsLabel={slotT?.claimWarningPointsLabel ?? "Points to be claimed"}
        cancelLabel={slotT?.cancelButton ?? "Cancel"}
        claimLabel={slotT?.claim ?? "Claim"}
      />

      {/* Preview Poster Dialog */}
      <PreviewPosterDialog
        open={previewPosterOpen}
        onClose={() => setPreviewPosterOpen(false)}
        slotDetailsData={slotDetailsData}
        posterImageUrl={null}
      />
    </>
  );
};

export default SlotDetailDialog;
