import React from "react";
import { Button } from "@mui/material";
import { COLORS } from "@constants";

interface MainButtonProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export const MainButton = ({
  children,
  className = "",
  color = COLORS.primary,
  disabled = false,
  onClick,
  type = "button",
}: MainButtonProps) => {
  return (
    <Button
      type={type}
      className={`text-normal font-normal font-proxima py-2 !px-4 !rounded-full transition-all duration-400 disabled:cursor-not-allowed ${className}`}
      sx={{
        backgroundColor: color,
        border: `1px solid ${color}`,
        color: "white",
        transition: "all 0.25s ease",
        "&:hover:not(.Mui-disabled)": {
          backgroundColor: "transparent",
          color: `${color}`,
          "& svg g[mask] > rect": {
            fill: "currentColor",
            stroke: "currentColor",
          },
        },
        "&:active:not(.Mui-disabled)": {
          backgroundColor: color,
          color: COLORS.white,
          opacity: 0.9,
          "& svg g[mask] > rect": {
            fill: "currentColor",
            stroke: "currentColor",
          },
        },
        "&.Mui-disabled": {
          backgroundColor: "#C9C9C9",
          borderColor: "#BDBDBD",
          color: "#ffffff !important",
          opacity: 1,
          cursor: "not-allowed",
        },
      }}
      disabled={disabled}
      onClick={(e) => onClick?.(e)}
    >
      {children}
    </Button>
  );
};

export default MainButton;
