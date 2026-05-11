import React from "react";
import { Button } from "@mui/material";
import { COLORS } from "@constants";

interface OutlineButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export const OutlineButton = ({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: OutlineButtonProps) => {
  return (
    <Button
      type={type}
      className={`rounded-full transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed px-6 ${className}`}
      sx={{
        color: COLORS.generalText,
        border: `1px solid ${COLORS.darkBorder}`,
        backgroundColor: "transparent",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          backgroundColor: COLORS.grayLight,
          borderColor: COLORS.grayStrong,
        },
        "&:active": {
          backgroundColor: COLORS.grayStrong,
          borderColor: COLORS.grayStrong,
          color: COLORS.white,
        },
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default OutlineButton;
