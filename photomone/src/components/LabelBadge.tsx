import { Box, Typography } from "@mui/material";
import { COLORS } from "@constants";

interface LabelBadgeProps {
  label: string;
  color?: string;
  className?: string | null;
}

export const LabelBadge = ({
  label,
  color = COLORS.primary,
  className,
}: LabelBadgeProps) => {
  return (
    <Box
      className={[
        "!bg-[#F5F5F5] rounded-lg py-2 px-4 mb-4 inline-block",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      sx={{
        boxShadow:
          "0px 2px 0px 0px rgb(238, 237, 237), 0px 4px 0px 0px rgb(227, 227, 227)",
      }}
    >
      <Typography
        className="uppercase flex items-center gap-3"
        sx={{
          color,
          letterSpacing: "0.12em",
          fontSize: "0.8125rem",
        }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </Typography>
    </Box>
  );
};
