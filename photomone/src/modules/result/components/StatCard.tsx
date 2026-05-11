import { Box, Typography } from "@mui/material";
import { COLORS } from "@constants";

/** Hex color to rgba with alpha (0-1). */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  onClick?: () => void;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
  /** Localized label for the list/action button (screen readers). */
  actionAriaLabel?: string;
}

export const StatCard = ({
  label,
  value,
  color,
  icon,
  actionIcon,
  onActionClick,
  actionAriaLabel,
}: StatCardProps) => {
  const iconBgLight = hexToRgba(color, 0.15);

  return (
    <Box
      className="relative flex flex-row items-center gap-3 rounded-xl p-4 border"
      sx={{
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
      }}
    >
      {/* Menu icon on Exposures card only - top right */}
      {actionIcon && onActionClick && (
        <Box
          component="button"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onActionClick();
          }}
          className="absolute lg:top-3 top-1 lg:right-3 right-1 p-1 rounded-md border-0 bg-transparent cursor-pointer transition-colors flex items-center justify-center text-[#758599] hover:text-[#26262C] hover:bg-[#F0F0F0]"
          aria-label={actionAriaLabel || "View exposures list"}
        >
          {actionIcon}
        </Box>
      )}

      {/* Icon - left, light pastel background */}
      <Box
        className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0"
        sx={{
          backgroundColor: iconBgLight,
          color,
          "& svg": {
            width: "22px",
            height: "22px",
            maxWidth: "100%",
            maxHeight: "100%",
          },
        }}
      >
        {icon}
      </Box>

      {/* Label + Value - right of icon, stacked */}
      <Box className="flex flex-col min-w-0 flex-1">
        <Typography className="font-inter font-medium text-sm text-[#758599] truncate">
          {label}
        </Typography>
        <Typography className="font-bold text-xl text-[#26262C] truncate">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};
