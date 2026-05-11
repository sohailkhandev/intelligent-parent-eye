import { useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useAppContext } from "@providers";
import type { ToastItem } from "@providers";
import { Info, Close } from "@mui/icons-material";
import { ToastSuccessIcon, ToastErrorIcon, ToastWarningIcon } from "@assets/icons/svg";

const TOAST_COLORS = {
  success: {
    border: "#0FD433",
    bg: "#F5FFF7",
    iconSquareBg: "#D8FFDF",
    iconCircleBg: "#0FD433",
  },
  error: {
    border: "#FF0A00",
    bg: "#FFF4F4",
    iconSquareBg: "#FFE0E0",
    iconCircleBg: "#FF0A00",
  },
  warning: {
    border: "#F9A602",
    bg: "#FFFAF2",
    iconSquareBg: "#FFF0D8",
    iconCircleBg: "#F9A602",
  },
  info: {
    border: "#0D9DFD",
    bg: "#F0F8FF",
    iconSquareBg: "#E0EFFF",
    iconCircleBg: "#0D9DFD",
  },
} as const;

const AUTO_HIDE_DURATION_MS = 4000;

function ToastItemCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: (id: string) => void;
}) {
  const severity = (
    item.severity === "success" ||
    item.severity === "error" ||
    item.severity === "warning"
      ? item.severity
      : "info"
  ) as keyof typeof TOAST_COLORS;
  const colors = TOAST_COLORS[severity];

  const icons = {
    success: <ToastSuccessIcon />,
    error: <ToastErrorIcon />,
    warning: <ToastWarningIcon />,
    info: <Info sx={{ fontSize: 12, color: "white" }} />,
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose(item.id);
    }, AUTO_HIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [item.id, onClose]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "12px 20px",
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        minWidth: "320px",
        maxWidth: "450px",
        animation: "toastSlideIn 0.3s ease-out",
        "@keyframes toastSlideIn": {
          from: {
            opacity: 0,
            transform: "translateX(100px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      {/* Icon container: rounded square with icon or image thumbnail */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "12px",
          backgroundColor: colors.iconSquareBg,
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {item.imageUrl ? (
          <Box
            component="img"
            src={item.imageUrl}
            alt=""
            sx={{
              width: 44,
              height: 44,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: colors.iconCircleBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {severity === "info" ? (
              <Info sx={{ fontSize: 12, color: "white" }} />
            ) : (
              icons[severity]
            )}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          flex: 1,
          color: "#26262C",
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        {item.message}
      </Typography>

      <IconButton
        onClick={() => onClose(item.id)}
        sx={{
          padding: "6px",
          color: "#26262C",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
          },
        }}
      >
        <Close sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}

export const Toast = () => {
  const { toasts, hideToast } = useAppContext();

  if (toasts.length === 0) return null;

  return (
    <Box
      className="z-[10000000]"
      sx={{
        position: "fixed",
        top: 70,
        right: 16,
        zIndex: 100000,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        alignItems: "flex-end",
        pointerEvents: "none",
        "& > *": { pointerEvents: "auto" },
      }}
    >
      {toasts.map((item) => (
        <ToastItemCard key={item.id} item={item} onClose={hideToast} />
      ))}
    </Box>
  );
};

export default Toast;
