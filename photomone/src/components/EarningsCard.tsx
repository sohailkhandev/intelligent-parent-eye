import { Box, Typography } from "@mui/material";
import { EarningsIcon } from "@assets/icons/svg";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";

interface EarningsCardProps {
  /** Dollar amount from `authUser.earnings` (same as header). */
  earnings: number;
  className?: string;
  /** When true, earnings label is hidden below `sm` (mobile narrow layout). */
  hideLabelOnMobile?: boolean;
}

function formatEarningsDollars(earnings: number): string {
  return `$${earnings.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export const EarningsCard = ({
  earnings,
  className = "",
  hideLabelOnMobile = false,
}: EarningsCardProps) => {
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
            flexShrink: 0,
          }}
        >
          <EarningsIcon width={32} height={32} />
        </Box>
        <Typography
          className={`font-semibold text-base lg:text-lg truncate ${hideLabelOnMobile ? "hidden sm:block" : ""}`}
        >
          {home.earnings || "Earnings"}
        </Typography>
      </Box>
      <Typography
        className="font-bold text-xl lg:text-3xl shrink-0 text-left sm:text-right"
        sx={{ color: COLORS.primary }}
      >
        {formatEarningsDollars(earnings)}
      </Typography>
    </Box>
  );
};

export default EarningsCard;
