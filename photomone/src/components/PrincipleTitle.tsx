import { Typography } from "@mui/material";
import { COLORS } from "@constants";

interface PrincipleTitleProps {
  children: React.ReactNode;
}

export const PrincipleTitle = ({ children }: PrincipleTitleProps) => {
  return (
    <Typography
      className="lg:text-3xl mb-4"
      sx={{
        fontWeight: 700,
        color: COLORS.primary,
      }}
    >
      {children}
    </Typography>
  );
};
