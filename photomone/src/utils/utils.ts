import axios from "axios";
import { API_BASE_URL } from "@constants";

// Axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token and handling FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers.Authorization = authToken;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Utility functions
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Default entry counts for locked markets (what user will get after paying)
const DEFAULT_MARKET_ENTRIES: Record<number, number> = {
  4: 200,
  5: 100,
  6: 20,
  7: 15,
  8: 10,
  9: 5,
};

// Get entry count for a market - use default if locked (entries === 0)
export const getMarketEntryCount = (marketNumber: number, entries: number | null): number | undefined => {
  if (entries === null) return undefined; // Unlimited for free
  if (entries === 0) return DEFAULT_MARKET_ENTRIES[marketNumber]; // Locked - show default
  return entries;
};

// Get color for earned amount based on sales
export const getEarnedColor = (sales: number): string => {
  if (sales === 0) return "#EF4444"; // red
  return "#00FF40"; // green
};

// Format time difference from now
export const formatTime = (date: Date | string | null | undefined, abbreviated: boolean = false, translations?: any): string => {
  if (!date) {
    const timeTranslations = translations?.result?.time || {};
    return timeTranslations.na || "N/A";
  }
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const timeTranslations = translations?.result?.time || {};
  
  if (abbreviated) {
    const ab = timeTranslations.abbrev || {};
    const fmt = (template: string | undefined, fallback: string, n: number) =>
      (template || fallback).replace("{n}", String(n));
    if (diffInSeconds < 60) {
      return fmt(ab.seconds, "{n}s", Math.max(1, diffInSeconds));
    }
    if (diffInSeconds < 3600) {
      return fmt(ab.minutes, "{n}m", Math.floor(diffInSeconds / 60));
    }
    if (diffInSeconds < 86400) {
      return fmt(ab.hours, "{n}h", Math.floor(diffInSeconds / 3600));
    }
    if (diffInSeconds < 604800) {
      return fmt(ab.days, "{n}d", Math.floor(diffInSeconds / 86400));
    }
    if (diffInSeconds < 31536000) {
      return fmt(ab.weeks, "{n}w", Math.floor(diffInSeconds / 604800));
    }
    return fmt(ab.years, "{n}y", Math.floor(diffInSeconds / 31536000));
  }
  
  if (diffInSeconds < 60) {
    return timeTranslations.justNow || "Just now";
  }
  
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    const template = minutes === 1 ? (timeTranslations.minuteAgo || "{minutes} minute ago") : (timeTranslations.minutesAgo || "{minutes} minutes ago");
    return template.replace("{minutes}", minutes.toString());
  }
  
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    const template = hours === 1 ? (timeTranslations.hourAgo || "{hours} hour ago") : (timeTranslations.hoursAgo || "{hours} hours ago");
    return template.replace("{hours}", hours.toString());
  }
  
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    const template = days === 1 ? (timeTranslations.dayAgo || "{days} day ago") : (timeTranslations.daysAgo || "{days} days ago");
    return template.replace("{days}", days.toString());
  }
  
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    const template = weeks === 1 ? (timeTranslations.weekAgo || "{weeks} week ago") : (timeTranslations.weeksAgo || "{weeks} weeks ago");
    return template.replace("{weeks}", weeks.toString());
  }
  
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    const template = months === 1 ? (timeTranslations.monthAgo || "{months} month ago") : (timeTranslations.monthsAgo || "{months} months ago");
    return template.replace("{months}", months.toString());
  }
  
  const years = Math.floor(diffInSeconds / 31536000);
  const template = years === 1 ? (timeTranslations.yearAgo || "{years} year ago") : (timeTranslations.yearsAgo || "{years} years ago");
  return template.replace("{years}", years.toString());
};

// Translate market name based on translations
export const translateMarketName = (marketName: string | null | undefined, translations: any): string => {
  if (!marketName) return "N/A";
  
  const photomone = translations?.photomone || {};
  const marketNames = photomone?.marketNames || {};
  
  // Try to get translated market name (exact match)
  let translatedName = marketNames[marketName];
  if (translatedName) {
    return translatedName;
  }
  
  // Try with space format if hyphen format was provided (e.g., "Market-4" -> "Market 4")
  if (marketName.includes("-")) {
    const spaceFormat = marketName.replace("-", " ");
    translatedName = marketNames[spaceFormat];
    if (translatedName) {
      return translatedName;
    }
  }
  
  // Try with hyphen format if space format was provided (e.g., "Market 4" -> "Market-4")
  if (marketName.includes(" ")) {
    const hyphenFormat = marketName.replace(" ", "-");
    translatedName = marketNames[hyphenFormat];
    if (translatedName) {
      return translatedName;
    }
  }
  
  // Fallback to original name if translation not found
  return marketName;
};

// Translate gender value based on translations
export const translateGender = (gender: string | null | undefined, translations: any): string => {
  if (!gender) return "";
  
  const profile = translations?.profile || {};
  const genderOptions = profile?.genderOptions || {};
  
  // Normalize gender value to lowercase for comparison
  const normalizedGender = gender.toLowerCase();
  
  // Map API gender values to translation keys
  if (normalizedGender === "male") {
    return genderOptions.male || "Male";
  }
  if (normalizedGender === "female") {
    return genderOptions.female || "Female";
  }
  if (normalizedGender === "other") {
    return genderOptions.other || "Other";
  }
  
  // Fallback to capitalized original value
  return capitalize(gender);
};

/** Map app language (from LanguageProvider) to `Intl` / `toLocaleDateString` locale. */
export function appLanguageToDateLocale(lang: string): string {
  if (lang === "ur") return "ur-PK";
  return lang;
}

// Export transliteration utilities
export * from "./transliterate";

// Export sound effects
export * from "./soundEffects";

export * from "./slotApiErrorMessage";

export * from "./photoFusionI18n";

export * from "./geoLanguage";

