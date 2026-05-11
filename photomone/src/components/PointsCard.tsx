import { Box, Typography } from "@mui/material";
import { PointsIcon } from "@assets/icons/svg";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";

interface PointsCardProps {
  points: string | number;
  className?: string;
  /** When true, "Points" label is hidden below `sm` (mobile narrow layout). */
  hideLabelOnMobile?: boolean;
}

export const PointsCard = ({
  points,
  className = "",
  hideLabelOnMobile = false,
}: PointsCardProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const home = t.home || {};

  return (
    <Box
      className={`border rounded-xl flex items-center py-3 px-3 lg:px-6 ${
        hideLabelOnMobile
          ? "justify-start gap-2 sm:justify-between sm:gap-0"
          : "justify-between"
      } ${className}`}
      sx={{
        backgroundColor: COLORS.white,
        borderColor: COLORS.secondary,
      }}
    >
      <Box className="flex items-center gap-2 min-w-0">
        <Box
          sx={{
            color: COLORS.secondary,
            boxShadow: `0 0 10px -5px #758599`,
            borderRadius: "50%",
          }}
        >
          <PointsIcon />
        </Box>
        <Typography
          className={`font-semibold text-base lg:text-lg ${hideLabelOnMobile ? "hidden sm:block" : ""}`}
        >
          {home.points || "Points"}
        </Typography>
      </Box>
      <Typography
        className="font-bold text-xl lg:text-3xl shrink-0 text-left sm:text-right"
        sx={{ color: COLORS.primary }}
      >
        {points}
      </Typography>
    </Box>
  );
};

export default PointsCard;
