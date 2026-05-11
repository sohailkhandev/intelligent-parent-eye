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

export type ValidatedInputVariant = "default" | "outlined";

interface ValidatedInputProps {
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
  variant?: ValidatedInputVariant;
  /** When set, input is controlled. Pass onChange for editable; omit for read-only (disabled). */
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ValidatedInput = ({
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
  value: valueProp,
  onChange: onChangeProp,
}: ValidatedInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const isOutlined = variant === "outlined";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const defaultInputClass = `appearance-none block w-full px-4 py-3 font-normal text-white placeholder-gray-500 focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px] bg-[#0000004D] border-2 border-[#05588E1A] rounded-full focus:border-[#0D9DFD] hover:border-[#0D9DFD]/50 ${isPasswordType ? "pr-12" : ""} ${error ? "border-red-400 focus:border-red-400" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  const outlinedInputClass = `appearance-none block w-full px-4 py-3 focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px] rounded-xl placeholder:text-[#A0A0A0] ${isPasswordType ? "pr-12" : ""} ${error ? "border-red-500 focus:border-red-500" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm lg:text-normal font-proxima font-normal mb-2 ${isOutlined ? "text-[#26262C]" : "text-white/80"} ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={isPasswordType ? (showPassword ? "text" : "password") : type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          disabled={valueProp !== undefined && !onChangeProp ? true : disabled}
          maxLength={maxLength}
          minLength={minLength}
          {...(valueProp !== undefined ? { name, value: valueProp, onChange: onChangeProp } : register ?? {})}
          className={`${isOutlined ? outlinedInputClass : defaultInputClass} ${className}`}
          style={
            isOutlined
              ? {
                  backgroundColor: COLORS.white,
                  border: error
                    ? "2px solid #DE1C39"
                    : `1px solid ${COLORS.grayLight}`,
                  color: COLORS.generalText,
                }
              : undefined
          }
          onFocus={(e) => {
            if (isOutlined && !error)
              e.currentTarget.style.borderColor = COLORS.primary;
          }}
          onBlur={(e) => {
            if (isOutlined && !error)
              e.currentTarget.style.borderColor = COLORS.grayLight;
            register?.onBlur?.(e);
          }}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 focus:outline-none ${isOutlined ? "text-[#758599] hover:text-[#26262C]" : "text-white/60 hover:text-white"}`}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <p
          className={`mt-1 text-sm ${isOutlined ? "text-[#DE1C39]" : "text-red-300"}`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ValidatedInput;
