import { Typography } from "@mui/material";

interface SecondaryTextProps {
  title: string | React.ReactNode;
  className?: string;
}

export const SecondaryText = ({
  title,
  className = "",
  ...props
}: SecondaryTextProps) => {
  return (
    <Typography
      className={`text-white/70 font-medium text-sm lg:text-base ${className}`}
      {...props}
    >
      {title}
    </Typography>
  );
};

export default SecondaryText;
