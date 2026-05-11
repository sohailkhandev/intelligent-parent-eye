/**
 * Utility for transliterating/translating user-provided text (like usernames)
 * to match the selected language
 */

type Language = "en" | "ko" | "zh" | "ja" | "ur" | "hi" | "es" | "de" | "fr" | "ru";

/**
 * Simple transliteration mapping for common names
 * This is a basic implementation. For production, consider using:
 * - Google Translate API
 * - pinyin library for Chinese
 * - romaji library for Japanese
 */
const TRANSLITERATION_MAP: Record<string, Record<Language, string>> = {
  // Add common names/words here if needed
  // Example: "John" -> { zh: "约翰", ja: "ジョン", ko: "존" }
};

/**
 * Check if text contains only Latin/English characters
 */
const isLatinText = (text: string): boolean => {
  return /^[a-zA-Z0-9\s.,!?@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text);
};

/**
 * Transliterate text to target language
 * For now, returns original text. Can be extended with:
 * 1. Translation API integration
 * 2. Transliteration libraries
 * 3. Custom mapping dictionaries
 */
export const transliterateText = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  // If target language is English, return as-is
  if (targetLanguage === "en") {
    return text;
  }

  // If text is not Latin/English, return as-is (already in target language)
  if (!isLatinText(text)) {
    return text;
  }

  // Check if we have a mapping for this text
  if (TRANSLITERATION_MAP[text] && TRANSLITERATION_MAP[text][targetLanguage]) {
    return TRANSLITERATION_MAP[text][targetLanguage];
  }

  // TODO: Integrate with translation API here
  // Example with Google Translate API:
  // const translated = await translateText(text, 'en', targetLanguage);
  // return translated;

  // For now, return original text
  // In production, you would call a translation API here
  return text;
};

/**
 * Synchronous version - returns original text immediately
 * Use this for immediate display, then update with async version if needed
 */
export const transliterateTextSync = (
  text: string,
  targetLanguage: Language
): string => {
  if (targetLanguage === "en") {
    return text;
  }

  if (!isLatinText(text)) {
    return text;
  }

  // Check mapping
  if (TRANSLITERATION_MAP[text] && TRANSLITERATION_MAP[text][targetLanguage]) {
    return TRANSLITERATION_MAP[text][targetLanguage];
  }

  // Return original - will be updated by async version if API is configured
  return text;
};

/**
 * Hook to use transliteration in React components
 */
export const useTransliterate = () => {
  return {
    transliterate: transliterateText,
    transliterateSync: transliterateTextSync,
  };
};

