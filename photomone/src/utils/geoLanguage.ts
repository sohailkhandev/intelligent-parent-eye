import type { Language } from "@providers";

/** Once per browser: we have applied country-based UI language. */
export const GEO_LANGUAGE_INIT_KEY = "geoLanguageInitialized";

/** After a successful PUT /profile/language for this browser (while logged in). */
export const PROFILE_LANGUAGE_API_SYNC_KEY = "profileLanguageApiSynced";

/**
 * ISO 3166-1 alpha-2 → app language.
 * - Urdu-speaking regions (e.g. PK) → en (never auto-select ur).
 * - Any country not listed below → en.
 */
const COUNTRY_TO_LANGUAGE: Record<string, Language> = (() => {
  const m: Record<string, Language> = {};

  const add = (countries: string[], lang: Language) => {
    countries.forEach((c) => {
      m[c.toUpperCase()] = lang;
    });
  };

  add(
    [
      "DE",
      "AT",
      "CH",
      "LI",
    ],
    "de"
  );

  add(
    [
      "ES",
      "MX",
      "AR",
      "CO",
      "CL",
      "PE",
      "VE",
      "EC",
      "GT",
      "CU",
      "BO",
      "DO",
      "HN",
      "PY",
      "SV",
      "NI",
      "CR",
      "PA",
      "UY",
      "PR",
    ],
    "es"
  );

  add(
    [
      "FR",
      "MC",
      "LU",
      "SN",
      "CI",
      "CM",
      "MG",
      "NE",
      "ML",
      "BF",
      "CD",
      "GA",
      "TG",
      "BJ",
      "TD",
      "CF",
      "CG",
      "DJ",
      "KM",
      "HT",
    ],
    "fr"
  );

  add(["BE"], "fr");

  add(["IN"], "hi");

  add(["JP"], "ja");

  add(["KR"], "ko");

  add(["CN", "TW", "HK", "MO"], "zh");

  add(["RU", "BY", "KZ", "KG"], "ru");

  /** Urdu-speaking: use English in app, not ur */
  add(["PK"], "en");

  return m;
})();

export function countryCodeToLanguage(countryCode: string | null | undefined): Language {
  if (!countryCode || typeof countryCode !== "string") return "en";
  const code = countryCode.trim().toUpperCase();
  if (code.length !== 2) return "en";
  return COUNTRY_TO_LANGUAGE[code] ?? "en";
}

export async function fetchCountryCode(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutMs = 8000;
  const t = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { country_code?: string };
    const code = data?.country_code;
    if (typeof code === "string" && /^[a-zA-Z]{2}$/.test(code)) {
      return code.toUpperCase();
    }
    return null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(t);
  }
}
