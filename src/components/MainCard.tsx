import React from "react";
import { COLORS } from "@constants";

interface MainCardProps {
  children: React.ReactNode;
  className?: string;
}

export const MainCard = ({ children, className }: MainCardProps) => {
  return (
    <div
      className={`w-full max-w-[400px] rounded-xl py-8 px-6 md:py-10 md:px-8 ${className ?? ""}`}
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {children}
    </div>
  );
};

export default MainCard;
