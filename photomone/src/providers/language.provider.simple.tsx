/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language =
  | "en"
  | "ko"
  | "zh"
  | "ja"
  | "ur"
  | "hi"
  | "es"
  | "de"
  | "fr"
  | "ru";

const ALLOWED_LANGUAGES = new Set<Language>([
  "en",
  "ko",
  "zh",
  "ja",
  "ur",
  "hi",
  "es",
  "de",
  "fr",
  "ru",
]);

/** localStorage key for the active UI language */
export const LANGUAGE_STORAGE_KEY = "language";

/**
 * Set when the user explicitly picks a language (dropdown). Geo detection must not overwrite it.
 */
export const LANGUAGE_USER_PICKED_KEY = "languageUserPicked";

export function normalizeLanguage(raw: string | null): Language {
  if (raw && ALLOWED_LANGUAGES.has(raw as Language)) return raw as Language;
  return "en";
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

const RTL_LANGUAGES = new Set<Language>(["ur"]);

/** Files merged into the root translation object (same keys as old provider). */
const LOCALE_FILES = [
  "landing",
  "howItWorks",
  "faq",
  "footer",
  "aboutUs",
  "privacyPolicy",
  "termsAndConditions",
  "customerSupport",
  "auth",
  "sidebar",
  "home",
  "appHeader",
  "shop",
  "photomone",
  "market",
  "result",
  "profile",
  "promotionPackage",
  "promotionSocial",
  "notice",
  "notification",
  "slotDetail",
] as const;

const jsonPath = (lang: Language, name: string) => `/locales/${lang}/${name}.json`;

async function fetchJson(path: string): Promise<any | null> {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Prefer active language file; fall back to English so pages keep working when a locale is partial or missing. */
async function fetchJsonPreferLang(
  lang: Language,
  name: string
): Promise<any | null> {
  const primary = await fetchJson(jsonPath(lang, name));
  if (lang === "en") {
    return primary;
  }
  const fallback = await fetchJson(jsonPath("en", name));
  const primaryUsable =
    primary != null &&
    typeof primary === "object" &&
    !Array.isArray(primary) &&
    Object.keys(primary).length > 0;
  if (primaryUsable) {
    return primary;
  }
  return fallback;
}

function mergeHowItWorks(landing: any, howFile: any) {
  const merged =
    landing?.howItWorks && typeof landing.howItWorks === "object"
      ? { ...landing.howItWorks }
      : {};
  if (howFile && typeof howFile === "object") {
    Object.keys(howFile).forEach((key) => {
      if (key.startsWith("step") && typeof howFile[key] === "object") {
        merged[key] = {
          ...(merged[key] || {}),
          ...howFile[key],
        };
      } else {
        merged[key] = howFile[key];
      }
    });
  }
  return Object.keys(merged).length > 0 ? merged : null;
}

function mergePhotomone(landing: any, photoFile: any) {
  const merged =
    landing?.photomone && typeof landing.photomone === "object"
      ? { ...landing.photomone }
      : {};
  if (photoFile && typeof photoFile === "object") {
    Object.keys(photoFile).forEach((key) => {
      if (!merged[key] || typeof photoFile[key] !== "object") {
        merged[key] = photoFile[key];
      } else if (
        typeof merged[key] === "object" &&
        typeof photoFile[key] === "object"
      ) {
        merged[key] = { ...merged[key], ...photoFile[key] };
      }
    });
  }
  return Object.keys(merged).length > 0 ? merged : null;
}

async function loadTranslationsForLanguage(lang: Language): Promise<any> {
  const headerJson =
    (await fetchJsonPreferLang(lang, "header")) ?? {};

  const appHeader = await fetchJsonPreferLang(lang, "appHeader");
  const nestedHeader =
    appHeader?.header && typeof appHeader.header === "object"
      ? appHeader.header
      : {};

  const mergedHeader =
    typeof headerJson === "object" && headerJson
      ? { ...nestedHeader, ...headerJson }
      : { ...nestedHeader };

  const out: any = { header: mergedHeader };
  if (appHeader) out.appHeader = appHeader;

  const [landing, howItWorksFile, photomoneFile, ...restFiles] =
    await Promise.all([
      fetchJsonPreferLang(lang, "landing"),
      fetchJsonPreferLang(lang, "howItWorks"),
      fetchJsonPreferLang(lang, "photomone"),
      ...LOCALE_FILES.filter(
        (name) =>
          name !== "landing" &&
          name !== "howItWorks" &&
          name !== "photomone" &&
          name !== "appHeader"
      ).map((name) => fetchJsonPreferLang(lang, name)),
    ]);

  const namesAfterPhotomone = LOCALE_FILES.filter(
    (name) =>
      name !== "landing" &&
      name !== "howItWorks" &&
      name !== "photomone" &&
      name !== "appHeader"
  );

  if (landing && typeof landing === "object") {
    Object.assign(out, landing);
  }

  const mergedHow = mergeHowItWorks(out, howItWorksFile);
  if (mergedHow) out.howItWorks = mergedHow;

  const mergedPhoto = mergePhotomone(out, photomoneFile);
  if (mergedPhoto) out.photomone = mergedPhoto;

  namesAfterPhotomone.forEach((key, i) => {
    const data = restFiles[i];
    if (data) out[key] = data;
  });

  return out;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() =>
    normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY))
  );

  const [translations, setTranslations] = useState<any>({ header: {} });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const next = await loadTranslationsForLanguage(language);
        if (!cancelled) setTranslations(next);
      } catch {
        if (!cancelled) setTranslations({ header: {} });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    const isRTL = RTL_LANGUAGES.has(language);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    const next = normalizeLanguage(lang);
    setLanguageState(next);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({ language, setLanguage, translations }),
    [language, translations]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
