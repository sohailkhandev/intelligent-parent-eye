import { Typography } from "@mui/material";
import { COLORS } from "@constants";

interface FormHeadingProps {
  title: string;
  className?: string;
}

export const FormHeading = ({ title, className = "" }: FormHeadingProps) => {
  return (
    <Typography
      variant="h2"
      component="h2"
      className={`!font-bold !text-2xl lg:!text-3xl ${className}`}
      sx={{ color: COLORS.generalText }}
    >
      {title}
    </Typography>
  );
};

export default FormHeading;
