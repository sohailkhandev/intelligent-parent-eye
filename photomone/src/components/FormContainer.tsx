import React from "react";
import { Box } from "@mui/material";
import { FormHeading } from "./FormHeading";
import { CloseIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";

interface FormContainerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  headingClassName?: string;
}

export const FormContainer = ({
  title,
  onClose,
  children,
  className = "",
  headingClassName = "",
}: FormContainerProps) => {
  return (
    <Box
      className={`w-full flex flex-col relative rounded-4xl px-6 lg:px-16 mx-auto ${className}`}
      sx={{
        backgroundColor: "#F4F4F5",
        boxShadow:
          "0px -4px 0px 0px #ffffff, 0px 8px 0px 5px rgb(227, 227, 227)",
        padding: "16px 24px 20px",
        "@media (min-width: 1200px)": {
          padding: "24px 24px 32px",
        },
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 p-1 rounded-full hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
        sx={{
          color: COLORS.secondary,
          "& svg": { width: 20, height: 20 },
          "@media (min-width: 1200px)": {
            "& svg": { width: 32, height: 32 },
          },
        }}
        aria-label="Close"
      >
        <CloseIcon />
      </Box>
      <FormHeading
        title={title}
        className={`!text-center mt-6 lg:mt-10 ${headingClassName}`}
      />
      {children}
    </Box>
  );
};

export default FormContainer;
