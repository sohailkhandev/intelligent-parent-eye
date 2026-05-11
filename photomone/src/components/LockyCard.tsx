import { Box, Typography } from "@mui/material";
import { LockyKeyIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import { useLanguage } from "@providers";

interface LockyCardProps {
  locky: string | number;
  className?: string;
  /** When true, "Locky" label is hidden below `sm` (compact row: icon, value). */
  hideLabelOnMobile?: boolean;
}

export const LockyCard = ({
  locky,
  className = "",
  hideLabelOnMobile = false,
}: LockyCardProps) => {
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
        borderColor: COLORS.primary,
      }}
    >
      <Box className="flex items-center gap-2 min-w-0">
        <Box
          sx={{
            boxShadow: `0 0 10px -5px ${COLORS.primary}`,
            borderRadius: "50%",
            flexShrink: 0,
          }}
        >
          <LockyKeyIcon />
        </Box>
        <Typography
          className={`font-semibold text-base lg:text-lg ${hideLabelOnMobile ? "hidden sm:block" : ""}`}
        >
          {home.locky || "Locky"}
        </Typography>
      </Box>
      <Typography
        className="font-bold text-xl lg:text-3xl shrink-0 text-left sm:text-right"
        sx={{ color: "#F9A602" }}
      >
        {locky}
      </Typography>
    </Box>
  );
};

export default LockyCard;
