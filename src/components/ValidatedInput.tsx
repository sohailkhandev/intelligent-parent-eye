import { Box, TextField } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";
import { COLORS } from "@constants";

interface ValidatedInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  value?: string;
  onChange?: (value: string) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  /** "outlined" = box with border, "underline" = bottom border only */
  variant?: "outlined" | "underline";
}

const underlineSx = (error: boolean) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    backgroundColor: "transparent",
    color: COLORS.generalText,
    fontSize: "0.9375rem",
    paddingLeft: 0,
    paddingRight: 0,
    "& fieldset": {
      border: "none",
      borderBottom: `2px solid ${error ? COLORS.secondary : COLORS.border}`,
      borderRadius: 0,
    },
    "&:hover fieldset": {
      borderBottomColor: error ? COLORS.secondary : COLORS.darkBorder,
    },
    "&.Mui-focused fieldset": {
      borderBottomWidth: "2px",
      borderBottomColor: error ? COLORS.secondary : COLORS.primary,
    },
    "& .MuiInputBase-input": {
      padding: "10px 0 8px",
    },
    "& .MuiInputBase-input::placeholder": {
      color: COLORS.generalText,
      opacity: 0.5,
    },
    "&.Mui-disabled": {
      opacity: 0.7,
      "& fieldset": { borderBottomColor: COLORS.border },
    },
  },
  "& .MuiFormHelperText-root": {
    color: COLORS.secondary,
    marginLeft: 0,
    marginTop: "4px",
    fontSize: "0.75rem",
  },
});

const outlinedSx = (error: boolean) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: COLORS.white,
    color: COLORS.generalText,
    fontSize: "0.9375rem",
    "& fieldset": {
      borderColor: error ? COLORS.secondary : COLORS.border,
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: error ? COLORS.secondary : COLORS.darkBorder,
    },
    "&.Mui-focused fieldset": {
      borderColor: error ? COLORS.secondary : COLORS.primary,
      borderWidth: "1.5px",
    },
    "& .MuiInputBase-input": {
      padding: "10px 14px",
    },
    "& .MuiInputBase-input::placeholder": {
      color: COLORS.generalText,
      opacity: 0.5,
    },
    "&.Mui-disabled": {
      backgroundColor: COLORS.white,
      opacity: 0.7,
      "& fieldset": { borderColor: COLORS.border },
    },
  },
  "& .MuiFormHelperText-root": {
    color: COLORS.secondary,
    marginLeft: "14px",
    marginTop: "4px",
    fontSize: "0.75rem",
  },
});

export const ValidatedInput = ({
  label,
  type = "text",
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  register,
  value,
  onChange,
  variant = "outlined",
}: ValidatedInputProps) => {
  const sx = variant === "underline" ? underlineSx(!!error) : outlinedSx(!!error);
  return (
    <Box>
      <label
        className="block text-sm mb-1.5 font-medium"
        style={{ color: COLORS.generalText }}
      >
        {label}
        {required && <span style={{ color: COLORS.secondary }}> *</span>}
      </label>
      <TextField
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        helperText={helperText || (typeof error === "string" ? error : "")}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        sx={sx}
        {...register}
      />
    </Box>
  );
};

export default ValidatedInput;
