import React from "react";
import { Typography } from "@mui/material";

interface MainHeadingProps {
  title: string | React.ReactNode;
  className?: string;
}

export const MainHeading = ({
  title,
  className = "",
  ...props
}: MainHeadingProps) => {
  return (
    <Typography
      variant="h3"
      component="h3"
      className={`!text-[1.8em] !font-bold lg:!text-[2.5em] mb-6 lg:mb-8 ${className}`}
      {...props}
    >
      {title}
    </Typography>
  );
};

export default MainHeading;
