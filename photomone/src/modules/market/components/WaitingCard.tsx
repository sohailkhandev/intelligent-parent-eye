import { Box, Typography } from "@mui/material";
import { useLanguage } from "@providers";
import { Loading } from "@components";

interface WaitingCardProps {
  className?: string;
  text?: string;
  size?: "small" | "default" | "large";
}

export const WaitingCard = ({
  className = "",
  text,
  size = "default",
}: WaitingCardProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const marketTranslations = t?.market || {};
  const screen = marketTranslations?.screen || {};
  const defaultText = text || screen.waitingEllipsis || "Waiting...";
  const sizeConfig = {
    small: {
      spinnerSize: 16,
      textSize: "text-xs",
      spacing: "mb-1",
    },
    default: {
      spinnerSize: 20,
      textSize: "text-sm",
      spacing: "mb-2",
    },
    large: {
      spinnerSize: 24,
      textSize: "text-base",
      spacing: "mb-3",
    },
  };

  const config = sizeConfig[size] || sizeConfig.default;

  return (
    <Box
      className={`${className} bg-black/30 rounded-2xl flex items-center justify-center border-2 border-[#0D9DFD]/20`}
    >
      <Box className="text-center">
        <Box className={`flex justify-center items-center ${config.spacing}`}>
          <Loading size={config.spinnerSize} />
        </Box>
        <Typography
          className={`text-white ${config.textSize} font-proxima mt-3`}
        >
          {defaultText}
        </Typography>
      </Box>
    </Box>
  );
};

export default WaitingCard;
