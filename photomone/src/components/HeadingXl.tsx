import { Typography, TypographyProps } from "@mui/material";

interface HeadingXlProps extends Omit<TypographyProps, "variant"> {
  children: React.ReactNode;
  className?: string;
}

export const HeadingXl = ({
  children,
  className = "",
  ...props
}: HeadingXlProps) => {
  return (
    <Typography
      variant="h6"
      component="h4"
      className={`font-bold text-white text-lg lg:text-xl ${className}`}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default HeadingXl;
