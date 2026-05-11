import { getCountries } from "react-phone-number-input";
import { Control, UseFormRegisterReturn } from "react-hook-form";
import { ValidatedSelect } from "./ValidatedSelect";
import type { ValidatedSelectVariant } from "./ValidatedSelect";

export interface CountryOption {
  code: string;
  name: string;
}

const getCountryName = (countryCode: string): string =>
  new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) ||
  countryCode;

/** Shared list of countries (code + name). Use in forms and for resolving code/name. */
const COUNTRY_LIST: CountryOption[] = getCountries().map((code) => ({
  code,
  name: getCountryName(code),
}));

export function getCountryList(): CountryOption[] {
  return COUNTRY_LIST;
}

/** Get display name for a country code (e.g. "US" -> "United States"). */
export function getCountryDisplayName(countryCode: string): string {
  return getCountryName(countryCode);
}

const countrySelectOptions = COUNTRY_LIST.map((c) => ({
  value: c.name,
  label: c.name,
}));

interface CountrySelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  control?: Control<any>;
  variant?: ValidatedSelectVariant;
  id?: string;
  name?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export const CountrySelect = ({
  label = "Country",
  placeholder = "Select your country",
  error,
  register,
  variant = "outlined",
  id,
  name,
  className = "",
  labelClassName = "",
  disabled = false,
}: CountrySelectProps) => {
  return (
    <ValidatedSelect
      id={id}
      name={name}
      label={label}
      placeholder={placeholder}
      error={error}
      register={register}
      options={countrySelectOptions}
      variant={variant}
      className={className}
      labelClassName={labelClassName}
      disabled={disabled}
    />
  );
};

export default CountrySelect;
