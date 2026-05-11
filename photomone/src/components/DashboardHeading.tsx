import { Typography, Box } from "@mui/material";
import { COLORS } from "@constants";

interface DashboardHeadingProps {
  title: string | React.ReactNode;
  className?: string;
  tooltip?: string;
}

export const DashboardHeading = ({
  title,
  className = "",
  tooltip,
  ...props
}: DashboardHeadingProps) => {
  return (
    <Box
      className={`flex items-center gap-2 border-b pb-4 ${className}`}
      sx={{ borderColor: COLORS.border }}
    >
      <Typography
        variant="h3"
        component="h3"
        className="font-proxima text-[1.5em] font-semibold uppercase"
        {...props}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default DashboardHeading;
