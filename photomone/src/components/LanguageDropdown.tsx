import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  useLanguage,
  useAppContext,
  useAuthContext,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_USER_PICKED_KEY,
  normalizeLanguage,
} from "@providers";
import { UserService } from "@services";
import { GlobeIcon } from "@assets/icons/svg";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";

export const LANGUAGE_OPTIONS = [
  { code: "en" as const, label: "English" },
  { code: "ko" as const, label: "한국어" },
  { code: "zh" as const, label: "中文" },
  { code: "ja" as const, label: "日本語" },
  { code: "ur" as const, label: "اردو" },
  { code: "hi" as const, label: "हिन्दी" },
  { code: "es" as const, label: "Español" },
  { code: "de" as const, label: "Deutsch" },
  { code: "fr" as const, label: "Français" },
  { code: "ru" as const, label: "Русский" },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["code"];

export interface LanguageDropdownProps {
  /** Optional label above the dropdown (e.g. globe + "Language:") */
  label?: React.ReactNode;
  /** When true, do not show the label (e.g. footer use without heading) */
  hideLabel?: boolean;
  className?: string;
}

export const LanguageDropdown = ({
  label,
  hideLabel = false,
  className = "",
}: LanguageDropdownProps) => {
  const { language, setLanguage, translations } = useLanguage();
  const { showToast } = useAppContext();
  const { token } = useAuthContext();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isTouchDevice = useMediaQuery("(hover: none)");
  const languageLabel =
    translations?.header?.language ?? "Language";
  const languageDisclaimer =
    translations?.header?.languageDisclaimer ??
    "Translations are AI-generated and may contain minor errors. If anything looks incorrect, please switch to English.";

  const handleChange = async (value: string) => {
    const code = value as LanguageCode;
    localStorage.setItem(LANGUAGE_USER_PICKED_KEY, "1");
    const next = normalizeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setLanguage(code);

    if (!token) return;
    try {
      await UserService.updateProfileLanguage({ language: next });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save language";
      showToast(message, "error");
    }
  };

  const effectiveLabel =
    label !== undefined ? label : (
      <>
        <GlobeIcon className="shrink-0" style={{ color: "#555555" }} />
        <span>{languageLabel}:</span>
      </>
    );

  return (
    <Box className={className}>
      {!hideLabel && (
        <Box className="flex items-center gap-2 text-[#555555] text-sm font-medium mb-2">
          {effectiveLabel}
          <Tooltip
            title={languageDisclaimer}
            arrow
            placement="top"
            open={isTouchDevice ? isTooltipOpen : undefined}
            onClose={() => setIsTooltipOpen(false)}
            disableFocusListener={isTouchDevice}
            disableHoverListener={isTouchDevice}
            disableTouchListener={isTouchDevice}
          >
            <Box
              component="span"
              className="inline-flex items-center"
              sx={{ color: "#8A8A8A", cursor: "help", lineHeight: 0 }}
              onClick={() => {
                if (isTouchDevice) setIsTooltipOpen((prev) => !prev);
              }}
            >
              <HelpOutlineIcon sx={{ fontSize: 16 }} />
            </Box>
          </Tooltip>
        </Box>
      )}
      <FormControl size="small" fullWidth>
        <Select
          value={language}
          onChange={(e) => handleChange(e.target.value)}
          displayEmpty
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            color: "#555555",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            border: "1px solid #DDDDDD",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "& .MuiSelect-select": { py: 1, px: 1.5 },
          }}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <MenuItem
              key={option.code}
              value={option.code}
              sx={{ fontSize: "0.875rem" }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageDropdown;
