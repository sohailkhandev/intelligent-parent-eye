import { useCallback, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  SvgIcon,
  CircularProgress,
} from "@mui/material";
import { Download, Share } from "@mui/icons-material";
import { MainButton, MainDialog } from "@components";
import type { SlotDetailsResponse, SlotDetailsData } from "@types";
import logo from "@assets/images/logo.png";
import { API_BASE_URL } from "@constants";
import { useLanguage, useAppContext } from "@providers";
import { COLORS } from "@constants";

const FacebookIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 24 }}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </SvgIcon>
);

const InstagramIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 24 }}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </SvgIcon>
);

const TikTokIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 24 }}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </SvgIcon>
);

interface PreviewPosterDialogProps {
  open: boolean;
  onClose: () => void;
  slotDetailsData?: SlotDetailsResponse | null;
  /** Pre-generated poster image (e.g. from share in photo details). When set, shown above social buttons with no HTML. */
  posterImageUrl?: string | null;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const FRAME_SIZE = 190;
const PORTRAIT_PCT = 0.92;
const RIBBON_MAX_WIDTH = 280;
const PADDING = 16;
const METRICS_GAP = 16; // vertical spacing between label/value, sections, and padding
const METRICS_BLOCK_WIDTH_PCT = 0.7; // metrics block width = 70% of canvas, centered
const BORDER_COLOR = "rgba(0,0,0,0.16)";

/** Same destinations as `Footer` social icons (external profiles / placeholders). */
const PREVIEW_POSTER_SOCIAL_HREF = {
  facebook: "https://web.facebook.com/profile.php?id=61583848603851",
  instagram: "https://www.instagram.com",
  tiktok: "https://www.tiktok.com/@photomone",
} as const;

/** Matches `Footer` social icon links (pink circle, responsive icon size). */
const previewPosterIconRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 2, // 16px — same as footer `gap-4`
} as const;

const previewPosterRoundIconSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  flexShrink: 0,
  width: { xs: 32, sm: 40 },
  height: { xs: 32, sm: 40 },
  borderRadius: "50%",
  backgroundColor: `${COLORS.secondary} !important`,
  color: "white !important",
  textDecoration: "none",
  transition: "opacity 0.2s ease",
  "&:hover": { opacity: 0.9 },
  "& svg": { width: 20, height: 20 },
  "@media (min-width: 640px)": {
    "& svg": { width: 25, height: 25 },
  },
} as const;

function loadImage(src: string, crossOrigin = true): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Same-origin (path or data) doesn't need crossOrigin; blob is already same-origin
    const isSameOrigin =
      src.startsWith("blob:") ||
      src.startsWith("data:") ||
      (typeof window !== "undefined" &&
        (src.startsWith("/") || src.startsWith(window.location.origin)));
    if (crossOrigin && !isSameOrigin) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Failed to load image: ${src.slice(0, 80)}...`));
    img.src = src;
  });
}

async function fetchImageAsObjectUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const t = (blob.type || "").toLowerCase();
    // Reject non-image responses (HTML, JSON, XML error pages)
    if (
      t === "text/html" ||
      t === "application/json" ||
      t === "application/xml" ||
      t === "text/xml"
    )
      return null;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

/** Returns a URL that can be loaded without CORS (same-origin proxy or blob). */
async function resolveImageUrlForCanvas(
  url: string,
  origin: string,
  isDev: boolean,
  apiBase: string
): Promise<string> {
  if (!url || !url.startsWith("http")) return url; // data: or relative
  const encoded = encodeURIComponent(url);
  let blobUrl: string | null = null;
  // In dev: Vite plugin serves /image-proxy; /api/image-proxy 404s. Try dev proxy first.
  if (isDev) {
    blobUrl = await fetchImageAsObjectUrl(
      `${origin}/image-proxy?url=${encoded}`
    );
  }
  if (!blobUrl) {
    blobUrl = await fetchImageAsObjectUrl(
      `${origin}/api/image-proxy?url=${encoded}`
    );
  }
  if (!blobUrl) {
    blobUrl = await fetchImageAsObjectUrl(
      `${apiBase}/proxy-image?url=${encoded}`
    );
  }
  if (
    !blobUrl &&
    isDev &&
    /user-products\.s3[.-]|user-products\.s3\./.test(url)
  ) {
    try {
      const pathname = new URL(url).pathname;
      blobUrl = await fetchImageAsObjectUrl(`${origin}/s3-proxy${pathname}`);
    } catch {
      /* ignore */
    }
  }
  if (!blobUrl) blobUrl = await fetchImageAsObjectUrl(url);
  if (!blobUrl && url.startsWith("https://")) {
    blobUrl = await fetchImageAsObjectUrl(
      `https://api.allorigins.win/raw?url=${encoded}`
    );
  }
  if (!blobUrl && url.startsWith("https://")) {
    blobUrl = await fetchImageAsObjectUrl(
      `https://corsproxy.io/?url=${encoded}`
    );
  }
  return blobUrl || url;
}

/**
 * Renders the poster to a canvas and returns a JPEG data URL.
 * Use when opening the preview poster from share (photo details): generate image, then show it in the dialog.
 */
export async function generatePosterImageDataUrl(
  slotData: SlotDetailsData
): Promise<string | null> {
  const {
    rankStyles,
    imageUrl,
    score,
    totalPoints,
    rankValue,
    ownerName,
    slotId,
  } = slotData;
  if (
    !rankStyles?.bgUrl ||
    !rankStyles?.ribbonUrl ||
    !rankStyles?.frameUrl ||
    !imageUrl
  ) {
    if (typeof console !== "undefined" && console.error) {
      console.error("[Poster] Missing data:", {
        hasRankStyles: !!rankStyles,
        hasImageUrl: !!imageUrl,
      });
    }
    return null;
  }

  const objectUrlsToRevoke: string[] = [];
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const isDev =
    typeof import.meta !== "undefined" &&
    (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const [bgResolved, ribbonResolved, frameResolved, userResolved] =
      await Promise.all([
        resolveImageUrlForCanvas(rankStyles.bgUrl, origin, isDev, API_BASE_URL),
        resolveImageUrlForCanvas(
          rankStyles.ribbonUrl,
          origin,
          isDev,
          API_BASE_URL
        ),
        resolveImageUrlForCanvas(
          rankStyles.frameUrl,
          origin,
          isDev,
          API_BASE_URL
        ),
        resolveImageUrlForCanvas(imageUrl, origin, isDev, API_BASE_URL),
      ]);

    [bgResolved, ribbonResolved, frameResolved, userResolved].forEach((u) => {
      if (u.startsWith("blob:")) objectUrlsToRevoke.push(u);
    });

    const loaded = await Promise.all([
      loadImage(bgResolved),
      loadImage(ribbonResolved),
      loadImage(frameResolved),
      loadImage(userResolved),
      loadImage(logo),
    ]).catch((err) => {
      if (typeof console !== "undefined" && console.error) {
        console.error("[Poster] Image load failed:", err);
      }
      return null;
    });

    if (!loaded) return null;
    const [bgImg, ribbonImg, frameImg, userImg, logoImg] = loaded;

    ctx.drawImage(bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const ribbonW = Math.min(CANVAS_WIDTH * 0.8, RIBBON_MAX_WIDTH);
    const ribbonH =
      (ribbonImg.naturalHeight / ribbonImg.naturalWidth) * ribbonW;
    const ribbonX = (CANVAS_WIDTH - ribbonW) / 2;
    const ribbonY = PADDING + 24;
    ctx.drawImage(ribbonImg, ribbonX, ribbonY, ribbonW, ribbonH);

    const frameX = (CANVAS_WIDTH - FRAME_SIZE) / 2;
    const frameY = ribbonY + ribbonH + 12;
    const portraitSize = Math.round(FRAME_SIZE * PORTRAIT_PCT);
    const portraitX = frameX + (FRAME_SIZE - portraitSize) / 2;
    const portraitY = frameY + (FRAME_SIZE - portraitSize) / 2;
    ctx.drawImage(userImg, portraitX, portraitY, portraitSize, portraitSize);
    ctx.drawImage(frameImg, frameX, frameY, FRAME_SIZE, FRAME_SIZE);

    const metricsBlockTopY = frameY + FRAME_SIZE + 20;
    const labelBaseline = metricsBlockTopY + METRICS_GAP + 14;
    const valueBaseline = labelBaseline + METRICS_GAP + 18;
    const metricsBlockBottomY = valueBaseline + 9 + METRICS_GAP;
    const ownerY = metricsBlockBottomY + METRICS_GAP + 14;
    const photoIdY = ownerY + METRICS_GAP + 12;

    const metricsColor = "#929292";
    ctx.fillStyle = metricsColor;
    ctx.font = "500 14px Poppins, Arial, sans-serif";
    ctx.textAlign = "center";

    const metricsBlockWidth = CANVAS_WIDTH * METRICS_BLOCK_WIDTH_PCT;
    const metricsBlockLeft = (CANVAS_WIDTH - metricsBlockWidth) / 2;
    const col1X = metricsBlockLeft + metricsBlockWidth / 6;
    const col2X = metricsBlockLeft + metricsBlockWidth / 2;
    const col3X = metricsBlockLeft + (metricsBlockWidth * 5) / 6;
    const sepX1 = metricsBlockLeft + metricsBlockWidth / 3;
    const sepX2 = metricsBlockLeft + (metricsBlockWidth * 2) / 3;

    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(
      Math.floor(metricsBlockLeft),
      Math.floor(metricsBlockTopY),
      Math.ceil(metricsBlockWidth),
      1
    );

    ctx.fillStyle = metricsColor;
    ctx.fillText("RANK:", col1X, labelBaseline);
    ctx.font = "500 18px Poppins, Arial, sans-serif";
    ctx.fillText(
      `${rankValue != null ? Number(rankValue).toFixed(0) : "0"}%`,
      col1X,
      valueBaseline
    );

    ctx.fillStyle = BORDER_COLOR;
    const sepTop = labelBaseline - 14;
    const sepHeight = valueBaseline + 9 - sepTop;
    ctx.fillRect(Math.floor(sepX1), sepTop, 1, sepHeight);
    ctx.fillRect(Math.floor(sepX2), sepTop, 1, sepHeight);

    ctx.fillStyle = metricsColor;
    ctx.font = "500 14px Poppins, Arial, sans-serif";
    ctx.fillText("SCORE:", col2X, labelBaseline);
    ctx.font = "500 18px Poppins, Arial, sans-serif";
    ctx.fillText(
      `${score != null ? Number(score).toFixed(0) : "0"}`,
      col2X,
      valueBaseline
    );

    ctx.fillStyle = metricsColor;
    ctx.font = "500 14px Poppins, Arial, sans-serif";
    ctx.fillText("SALES:", col3X, labelBaseline);
    ctx.font = "500 18px Poppins, Arial, sans-serif";
    ctx.fillText((totalPoints ?? 0).toLocaleString(), col3X, valueBaseline);

    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(
      Math.floor(metricsBlockLeft),
      Math.floor(metricsBlockBottomY),
      Math.ceil(metricsBlockWidth),
      1
    );

    ctx.fillStyle = metricsColor;
    ctx.font = "500 14px Poppins, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`OWNER: ${ownerName ?? "—"}`, CANVAS_WIDTH / 2, ownerY);
    ctx.fillText(`Photo ID: ${slotId ?? "—"}`, CANVAS_WIDTH / 2, photoIdY);

    const ownerInfoBottomBorderY = photoIdY + 4 + METRICS_GAP;
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(
      Math.floor(metricsBlockLeft),
      Math.floor(ownerInfoBottomBorderY),
      Math.ceil(metricsBlockWidth),
      1
    );

    const logoW = 128;
    const logoH = (logoImg.naturalHeight / logoImg.naturalWidth) * logoW;
    const logoY = ownerInfoBottomBorderY + 1 + METRICS_GAP;
    ctx.drawImage(logoImg, (CANVAS_WIDTH - logoW) / 2, logoY, logoW, logoH);

    return canvas.toDataURL("image/jpeg", 0.92);
  } finally {
    objectUrlsToRevoke.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
    });
  }
}

export const PreviewPosterDialog = ({
  open,
  onClose,
  slotDetailsData,
  posterImageUrl: _posterImageUrl,
}: PreviewPosterDialogProps) => {
  const { translations } = useLanguage();
  const { showToast } = useAppContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const homeT = translations?.home?.previewPoster;
  const pv = translations?.slotDetail?.previewPhoto;
  const slotData = slotDetailsData?.data;
  const imageUrl = slotData?.imageUrl ?? "";

  /** Download the photo only (not the certificate). */
  const handleDownloadPhoto = useCallback(async () => {
    if (!imageUrl) return;
    if (isDownloading) return;
    setIsDownloading(true);
    const objectUrlsToRevoke: string[] = [];
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const isDev =
      typeof import.meta !== "undefined" && import.meta.env?.DEV === true;
    try {
      let downloadUrl = imageUrl;
      if (imageUrl.startsWith("http")) {
        const resolved = await resolveImageUrlForCanvas(
          imageUrl,
          origin,
          isDev,
          API_BASE_URL
        );
        if (resolved.startsWith("blob:")) objectUrlsToRevoke.push(resolved);
        downloadUrl = resolved;
      }
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Failed to fetch image");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `photomone-photo-${Date.now()}.jpg`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 300);
      showToast(
        pv?.downloadPhotoSuccess ??
          homeT?.downloadSuccess ??
          "Photo downloaded",
        "success"
      );
    } catch (err) {
      console.error("[DownloadPhoto]", err);
      showToast(
        pv?.downloadFailed ?? homeT?.downloadFailed ?? "Download failed.",
        "error"
      );
    } finally {
      objectUrlsToRevoke.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      });
      setIsDownloading(false);
    }
  }, [
    imageUrl,
    isDownloading,
    showToast,
    homeT?.downloadSuccess,
    homeT?.downloadFailed,
    pv?.downloadPhotoSuccess,
    pv?.downloadFailed,
  ]);

  // const score = slotData?.score ?? null;
  // const totalPoints = slotData?.totalPoints ?? null;
  // const rankValue = slotData?.rankValue ?? null;
  // const rankStyles = slotData?.rankStyles;

  /* Certificate (canvas) download - UNUSED: Download button uses handleDownloadPhoto (photo only) */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for reference, certificate commented out
  // const handleDownload = useCallback(async () => {
  //   if (!slotData || !rankStyles || !imageUrl) return;
  //   if (isDownloading) return;

  //   setIsDownloading(true);
  //   const objectUrlsToRevoke: string[] = [];
  //   const origin = window.location.origin;
  //   const isDev =
  //     typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

  //   try {
  //     const canvas = document.createElement("canvas");
  //     canvas.width = CANVAS_WIDTH;
  //     canvas.height = CANVAS_HEIGHT;
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) throw new Error("Canvas not supported");

  //     // Resolve all cross-origin image URLs via proxy (bg, ribbon, frame, user photo)
  //     const [bgResolved, ribbonResolved, frameResolved, userResolved] =
  //       await Promise.all([
  //         resolveImageUrlForCanvas(
  //           rankStyles.bgUrl,
  //           origin,
  //           isDev,
  //           API_BASE_URL
  //         ),
  //         resolveImageUrlForCanvas(
  //           rankStyles.ribbonUrl,
  //           origin,
  //           isDev,
  //           API_BASE_URL
  //         ),
  //         resolveImageUrlForCanvas(
  //           rankStyles.frameUrl,
  //           origin,
  //           isDev,
  //           API_BASE_URL
  //         ),
  //         resolveImageUrlForCanvas(imageUrl, origin, isDev, API_BASE_URL),
  //       ]);

  //     [bgResolved, ribbonResolved, frameResolved, userResolved].forEach((u) => {
  //       if (u.startsWith("blob:")) objectUrlsToRevoke.push(u);
  //     });

  //     if (imageUrl.startsWith("http") && !userResolved.startsWith("blob:")) {
  //       throw new Error(
  //         "Could not load image for export. The S3 bucket may be blocking cross-origin requests (CORS). " +
  //           "Ensure /api/image-proxy is deployed (Vercel) or configure S3 CORS to allow your domain."
  //       );
  //     }

  //     const [bgImg, ribbonImg, frameImg, userImg, logoImg] = await Promise.all([
  //       loadImage(bgResolved),
  //       loadImage(ribbonResolved),
  //       loadImage(frameResolved),
  //       loadImage(userResolved),
  //       loadImage(logo),
  //     ]).catch((e) => {
  //       console.error("[PosterDownload] load images failed", e);
  //       throw new Error("Could not load assets for export");
  //     });

  //     // 1. Background (cover)
  //     ctx.drawImage(bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  //     // 2. Ribbon (centered top, 80% max 280px)
  //     const ribbonW = Math.min(CANVAS_WIDTH * 0.8, RIBBON_MAX_WIDTH);
  //     const ribbonH =
  //       (ribbonImg.naturalHeight / ribbonImg.naturalWidth) * ribbonW;
  //     const ribbonX = (CANVAS_WIDTH - ribbonW) / 2;
  //     const ribbonY = PADDING + 24;
  //     ctx.drawImage(ribbonImg, ribbonX, ribbonY, ribbonW, ribbonH);

  //     // 3. Portrait (88% of frame, centered in frame area)
  //     const frameX = (CANVAS_WIDTH - FRAME_SIZE) / 2;
  //     const frameY = ribbonY + ribbonH + 12;
  //     const portraitSize = Math.round(FRAME_SIZE * PORTRAIT_PCT);
  //     const portraitX = frameX + (FRAME_SIZE - portraitSize) / 2;
  //     const portraitY = frameY + (FRAME_SIZE - portraitSize) / 2;
  //     ctx.drawImage(userImg, portraitX, portraitY, portraitSize, portraitSize);

  //     // 4. Frame overlay
  //     ctx.drawImage(frameImg, frameX, frameY, FRAME_SIZE, FRAME_SIZE);

  //     // 5. Metrics (RANK | SCORE | SALES) – top/bottom borders, 16px vertical spacing
  //     const metricsBlockTopY = frameY + FRAME_SIZE + 20;
  //     const labelBaseline = metricsBlockTopY + METRICS_GAP + 14;
  //     const valueBaseline = labelBaseline + METRICS_GAP + 18;
  //     const metricsBlockBottomY = valueBaseline + 9 + METRICS_GAP;
  //     const ownerY = metricsBlockBottomY + METRICS_GAP + 14;
  //     const photoIdY = ownerY + METRICS_GAP + 12;

  //     const metricsColor = "#929292";
  //     ctx.fillStyle = metricsColor;
  //     ctx.font = "500 14px Poppins, Arial, sans-serif";
  //     ctx.textAlign = "center";

  //     const metricsBlockWidth = CANVAS_WIDTH * METRICS_BLOCK_WIDTH_PCT;
  //     const metricsBlockLeft = (CANVAS_WIDTH - metricsBlockWidth) / 2;
  //     const col1X = metricsBlockLeft + metricsBlockWidth / 6;
  //     const col2X = metricsBlockLeft + metricsBlockWidth / 2;
  //     const col3X = metricsBlockLeft + (metricsBlockWidth * 5) / 6;
  //     const sepX1 = metricsBlockLeft + metricsBlockWidth / 3;
  //     const sepX2 = metricsBlockLeft + (metricsBlockWidth * 2) / 3;

  //     ctx.fillStyle = BORDER_COLOR;
  //     ctx.fillRect(
  //       Math.floor(metricsBlockLeft),
  //       Math.floor(metricsBlockTopY),
  //       Math.ceil(metricsBlockWidth),
  //       1
  //     );

  //     ctx.fillStyle = metricsColor;
  //     ctx.fillText("RANK:", col1X, labelBaseline);
  //     ctx.font = "500 18px Poppins, Arial, sans-serif";
  //     ctx.fillText(
  //       `${rankValue != null ? Number(rankValue).toFixed(0) : "0"}%`,
  //       col1X,
  //       valueBaseline
  //     );

  //     ctx.fillStyle = BORDER_COLOR;
  //     const sepTop = labelBaseline - 14;
  //     const sepHeight = valueBaseline + 9 - sepTop;
  //     ctx.fillRect(Math.floor(sepX1), sepTop, 1, sepHeight);
  //     ctx.fillRect(Math.floor(sepX2), sepTop, 1, sepHeight);

  //     ctx.fillStyle = metricsColor;
  //     ctx.font = "500 14px Poppins, Arial, sans-serif";
  //     ctx.fillText("SCORE:", col2X, labelBaseline);
  //     ctx.font = "500 18px Poppins, Arial, sans-serif";
  //     ctx.fillText(
  //       `${score != null ? Number(score).toFixed(0) : "0"}`,
  //       col2X,
  //       valueBaseline
  //     );

  //     ctx.fillStyle = metricsColor;
  //     ctx.font = "500 14px Poppins, Arial, sans-serif";
  //     ctx.fillText("SALES:", col3X, labelBaseline);
  //     ctx.font = "500 18px Poppins, Arial, sans-serif";
  //     ctx.fillText((totalPoints ?? 0).toLocaleString(), col3X, valueBaseline);

  //     ctx.fillStyle = BORDER_COLOR;
  //     ctx.fillRect(
  //       Math.floor(metricsBlockLeft),
  //       Math.floor(metricsBlockBottomY),
  //       Math.ceil(metricsBlockWidth),
  //       1
  //     );

  //     // 6. OWNER & Photo ID (same 14px font, 16px gap between; border 16px below Photo ID)
  //     ctx.fillStyle = metricsColor;
  //     ctx.font = "500 14px Poppins, Arial, sans-serif";
  //     ctx.textAlign = "center";
  //     ctx.fillText(
  //       `OWNER: ${slotData.ownerName ?? "—"}`,
  //       CANVAS_WIDTH / 2,
  //       ownerY
  //     );
  //     ctx.fillText(
  //       `Photo ID: ${slotData.slotId ?? "—"}`,
  //       CANVAS_WIDTH / 2,
  //       photoIdY
  //     );

  //     const ownerInfoBottomBorderY = photoIdY + 4 + METRICS_GAP;
  //     ctx.fillStyle = BORDER_COLOR;
  //     ctx.fillRect(
  //       Math.floor(metricsBlockLeft),
  //       Math.floor(ownerInfoBottomBorderY),
  //       Math.ceil(metricsBlockWidth),
  //       1
  //     );

  //     // 7. Logo (16px below owner section border)
  //     const logoW = 128;
  //     const logoH = (logoImg.naturalHeight / logoImg.naturalWidth) * logoW;
  //     const logoY = ownerInfoBottomBorderY + 1 + METRICS_GAP;
  //     ctx.drawImage(logoImg, (CANVAS_WIDTH - logoW) / 2, logoY, logoW, logoH);

  //     const blob = await new Promise<Blob | null>((resolve) =>
  //       canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
  //     );
  //     if (!blob) throw new Error("Export failed");

  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `photomone-poster-${Date.now()}.jpg`;
  //     a.style.display = "none";
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     setTimeout(() => URL.revokeObjectURL(url), 500);

  //     showToast(homeT?.downloadSuccess ?? "Photo downloaded", "success");
  //   } catch (err) {
  //     console.error("[PosterDownload]", err);
  //     showToast(
  //       homeT?.downloadFailed ??
  //         "Download failed. Could not export certificate.",
  //       "error"
  //     );
  //   } finally {
  //     objectUrlsToRevoke.forEach((url) => {
  //       try {
  //         URL.revokeObjectURL(url);
  //       } catch {
  //         /* ignore */
  //       }
  //     });
  //     setIsDownloading(false);
  //   }
  // }, [
  //   slotData,
  //   rankStyles,
  //   imageUrl,
  //   rankValue,
  //   score,
  //   totalPoints,
  //   isDownloading,
  //   showToast,
  //   homeT?.downloadSuccess,
  //   homeT?.downloadFailed,
  // ]);

  if (!slotData) return null;

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={pv?.title ?? "Preview Photo"}
      maxWidth="sm"
    >
      {/* Enlarged photo only (certificate image commented out) */}
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt={pv?.photoAlt ?? "Photo"}
          sx={{
            width: "100%",
            maxWidth: 480,
            height: "auto",
            objectFit: "contain",
            mx: "auto",
            borderRadius: "8px",
            display: "block",
          }}
        />
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          gap: 1.5,
        }}
      >
        <MainButton
          onClick={handleDownloadPhoto}
          disabled={isDownloading}
          color={COLORS.primary}
          className="flex gap-2 items-center !min-w-[200px]"
        >
          {isDownloading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            <Share sx={{ fontSize: 16 }} aria-hidden />
          )}
          Share
        </MainButton>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: `${COLORS.generalText} !important`,
          }}
        >
          {pv?.downloadAndShare ??
            homeT?.downloadAndShare ??
            "Download and share"}
        </Typography>
        <Box sx={previewPosterIconRowSx}>
          <IconButton
            onClick={handleDownloadPhoto}
            disabled={isDownloading}
            aria-label={pv?.ariaDownload ?? "Download photo"}
            sx={{
              ...previewPosterRoundIconSx,
              padding: 0,
              minWidth: { xs: 32, sm: 40 },
              minHeight: { xs: 32, sm: 40 },
              "&:hover": {
                opacity: 0.9,
                backgroundColor: "#F9929B !important",
              },
              "&:disabled": {
                opacity: 0.8,
                backgroundColor: "rgba(249, 146, 155, 0.45) !important",
              },
            }}
          >
            {isDownloading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              <Download
                sx={{
                  fontSize: 20,
                  "@media (min-width: 640px)": { fontSize: 25 },
                }}
              />
            )}
          </IconButton>
          <Box
            component="a"
            href={PREVIEW_POSTER_SOCIAL_HREF.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={pv?.ariaFacebook ?? "Share on Facebook"}
            sx={previewPosterRoundIconSx}
          >
            <FacebookIcon />
          </Box>
          <Box
            component="a"
            href={PREVIEW_POSTER_SOCIAL_HREF.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={pv?.ariaTikTok ?? "Share on TikTok"}
            sx={previewPosterRoundIconSx}
          >
            <TikTokIcon />
          </Box>
          <Box
            component="a"
            href={PREVIEW_POSTER_SOCIAL_HREF.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={pv?.ariaInstagram ?? "Share on Instagram"}
            sx={previewPosterRoundIconSx}
          >
            <InstagramIcon />
          </Box>
        </Box>
      </Box>
    </MainDialog>
  );
};
