import { Typography } from "@mui/material";

interface CardTitleProps {
  title: string;
  className?: string;
}

export const CardTitle = ({ title, className = "" }: CardTitleProps) => {
  return (
    <Typography
      className={`font-semibold font-proxima text-[1.4em] ${className}`}
    >
      {title}
    </Typography>
  );
};

export default CardTitle;
