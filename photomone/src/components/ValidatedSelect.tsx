import { UseFormRegisterReturn } from "react-hook-form";
import { COLORS } from "@constants";

export interface SelectOption {
  value: string;
  label: string;
}

export type ValidatedSelectVariant = "default" | "outlined";

interface ValidatedSelectProps {
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  error?: string;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  options: SelectOption[];
  variant?: ValidatedSelectVariant;
  /** When set, select is controlled and read-only (e.g. for display-only fields like gender). */
  value?: string;
}

export const ValidatedSelect = ({
  id,
  name,
  placeholder = "Select an option",
  className = "",
  label,
  labelClassName = "",
  error,
  disabled = false,
  register,
  options,
  variant = "default",
  value: valueProp,
}: ValidatedSelectProps) => {
  const isOutlined = variant === "outlined";

  const defaultSelectClass = `peer appearance-none block w-full pr-10 px-4 py-3 text-white focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px] bg-[#0000004D] border-2 border-[#0D9DFD1F] rounded-full focus:border-[#0D9DFD] hover:border-[#0D9DFD]/50 ${error ? "border-red-400 focus:border-red-400" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  const outlinedSelectClass = `peer appearance-none block w-full pr-10 px-4 py-3 focus:outline-none text-sm lg:text-base transition-all duration-200 h-[48px] rounded-xl placeholder:text-[#A0A0A0] ${error ? "border-red-500 focus:border-red-500" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm lg:text-normal font-normal mb-2 text-[#26262C]  ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          disabled={valueProp !== undefined ? true : disabled}
          {...(valueProp !== undefined
            ? { name, value: valueProp }
            : (register ?? {}))}
          className={`${isOutlined ? outlinedSelectClass : defaultSelectClass} ${className}`}
          style={
            isOutlined
              ? {
                  backgroundColor: COLORS.white,
                  border: error
                    ? "2px solid #DE1C39"
                    : `1px solid ${COLORS.grayLight}`,
                  color: COLORS.generalText,
                }
              : { colorScheme: "dark" }
          }
        >
          <option
            value=""
            disabled
            className={
              isOutlined
                ? "bg-white text-[#A0A0A0]"
                : "bg-[#000000] text-white/50"
            }
          >
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className={
                isOutlined
                  ? "bg-white text-[#26262C]"
                  : "bg-[#000000] text-white"
              }
            >
              {option.label}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:rotate-180 ${isOutlined ? "text-[#758599] peer-focus:text-[#29C4D6]" : "text-white/60 peer-focus:text-[#0D9DFD]"}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
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

export default ValidatedSelect;
