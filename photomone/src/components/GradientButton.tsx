import React from "react";
import { Button } from "@mui/material";

interface GradientButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export const GradientButton = ({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: GradientButtonProps) => {
  return (
    <Button
      type={type}
      className={`bg-gradient-to-r from-[#7245EF] to-[#0D9DFD] !text-white cursor-pointer hover:opacity-80 text-sm lg:!text-base !py-3 !px-2 !font-medium !rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed !normal-case !w-[190px] mx-auto md:mx-0 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
