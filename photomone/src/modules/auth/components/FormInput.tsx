import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { COLORS } from "@constants";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export type FormInputVariant = "default" | "underline";

interface FormInputProps {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  label?: string;
  labelClassName?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  register?: UseFormRegisterReturn;
  variant?: FormInputVariant;
}

export const FormInput = ({
  id,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  className = "",
  label,
  labelClassName = "",
  error,
  disabled = false,
  maxLength,
  minLength,
  register,
  variant = "default",
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const isUnderline = variant === "underline";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const labelClass = isUnderline
    ? `block text-sm lg:text-base font-bold text-[#26262C]  ${labelClassName}`
    : `block text-sm lg:text-base font-medium text-white/80 ${labelClassName}`;

  const inputBaseClass =
    "appearance-none block w-full focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px]";
  const inputDefaultClass = `px-4 py-3 text-white placeholder-gray-500 bg-[#0000004D] border-2 border-[#D4D4D8] rounded-full focus:border-[#0D9DFD] hover:border-[#0D9DFD]/50 ${isPasswordType ? "pr-12" : ""} ${error ? "border-red-400 focus:border-red-400" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  const inputUnderlineClass = `px-0 py-3 bg-transparent border-0 border-b-2 rounded-none placeholder-gray-400 text-[#26262C] ${error ? "!border-b-red-400" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  const underlineStyle = isUnderline
    ? { borderBottomColor: error ? undefined : COLORS.grayLight }
    : undefined;

  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPasswordType ? (showPassword ? "text" : "password") : type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          {...register}
          className={`${inputBaseClass} ${isUnderline ? inputUnderlineClass : inputDefaultClass} ${className}`}
          style={underlineStyle}
          onFocus={(e) => {
            if (isUnderline && !error)
              e.currentTarget.style.borderBottomColor = COLORS.secondary;
            register?.onChange?.(e);
          }}
          onBlur={(e) => {
            if (isUnderline && !error)
              e.currentTarget.style.borderBottomColor = COLORS.grayLight;
            register?.onBlur?.(e);
          }}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <p
          className={`mt-1 text-sm ${isUnderline ? "text-red-500" : "text-red-300"}`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
