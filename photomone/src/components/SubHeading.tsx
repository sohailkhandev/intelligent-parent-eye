import { Typography } from "@mui/material";
import React from "react";

interface SubHeadingProps {
  title: string | React.ReactNode;
  className?: string;
}

export const SubHeading = ({ title, className = "" }: SubHeadingProps) => {
  return (
    <Typography
      variant="h3"
      component="h3"
      className={`text-white text-xl font-bold lg:text-[1.5em] ${className}`}
    >
      {title}
    </Typography>
  );
};

export default SubHeading;
