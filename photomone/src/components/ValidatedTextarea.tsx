import { UseFormRegisterReturn } from "react-hook-form";
import { COLORS } from "@constants";

export type ValidatedTextareaVariant = "default" | "underline" | "outlined";

interface ValidatedTextareaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  register?: UseFormRegisterReturn;
  variant?: ValidatedTextareaVariant;
}

export const ValidatedTextarea = ({
  id,
  name,
  placeholder,
  className = "",
  label,
  labelClassName = "",
  error,
  disabled = false,
  maxLength,
  minLength,
  rows = 3,
  register,
  variant = "default",
}: ValidatedTextareaProps) => {
  const isUnderline = variant === "underline";
  const isOutlined = variant === "outlined";
  const labelClass = isUnderline
    ? `block text-sm lg:text-normal mb-2 font-bold text-[#26262C] ${labelClassName}`
    : isOutlined
      ? `block text-sm lg:text-normal mb-2 font-normal text-[#262626] ${labelClassName}`
      : `block text-sm lg:text-normal mb-2 font-normal text-white/80  ${labelClassName}`;
  const textareaDefaultClass = `w-full px-4 py-3 text-white placeholder-gray-500 bg-[#0000004D] border-2 border-[#0D9DFD1F] rounded-[12px] focus:outline-none focus:border-[#0D9DFD] hover:border-[#0D9DFD]/50 text-sm lg:text-base transition-all duration-200 resize-none ${error ? "border-red-400 focus:border-red-400" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  const textareaUnderlineClass = `w-full px-0 py-3 bg-transparent border-0 border-b-2 rounded-none placeholder-gray-400 text-[#26262C] focus:outline-none text-sm lg:text-base transition-all duration-200 resize-none ${error ? "!border-b-red-400" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  const textareaOutlinedClass = `w-full px-4 py-3 focus:outline-none text-sm lg:text-base transition-all duration-200 resize-y rounded-xl placeholder:text-[#A0A0A0] min-h-[80px] ${error ? "border-red-500 focus:border-red-500" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  const underlineStyle =
    isUnderline && !error ? { borderBottomColor: COLORS.grayLight } : undefined;
  const outlinedStyle = isOutlined
    ? {
        backgroundColor: COLORS.white,
        border: error ? "2px solid #DE1C39" : `1px solid ${COLORS.grayLight}`,
        color: COLORS.generalText,
      }
    : undefined;

  return (
    <div>
      {label && (
        <label htmlFor={id} className={`${labelClass}  ${labelClassName}`}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        {...register}
        className={`${isUnderline ? textareaUnderlineClass : isOutlined ? textareaOutlinedClass : textareaDefaultClass} ${className}`}
        style={underlineStyle ?? outlinedStyle}
        onFocus={(e) => {
          if (isUnderline && !error)
            e.currentTarget.style.borderBottomColor = COLORS.secondary;
          if (isOutlined && !error)
            e.currentTarget.style.borderColor = COLORS.primary;
        }}
        onBlur={(e) => {
          if (isUnderline && !error)
            e.currentTarget.style.borderBottomColor = COLORS.grayLight;
          if (isOutlined && !error)
            e.currentTarget.style.borderColor = COLORS.grayLight;
          register?.onBlur?.(e);
        }}
      />
      {error && (
        <p
          className={`mt-1 text-sm ${isUnderline || isOutlined ? "text-[#DE1C39]" : "text-red-300"}`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ValidatedTextarea;
