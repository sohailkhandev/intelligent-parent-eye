import { useState, useEffect } from "react";
import { useLanguage } from "@providers";
import { transliterateText, transliterateTextSync } from "@utils";

/**
 * Hook to transliterate usernames based on selected language
 * 
 * Usage:
 * const translatedUsername = useTransliterateUsername(authUser?.fullName);
 */
export const useTransliterateUsername = (username: string | undefined | null): string => {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState<string>(username || "");

  useEffect(() => {
    if (!username) {
      setTranslated("");
      return;
    }

    // Use sync version for immediate display
    const syncTranslated = transliterateTextSync(username, language);
    setTranslated(syncTranslated);

    // Optionally, update with async version if API is configured
    // This allows for real-time translation updates
    transliterateText(username, language)
      .then((asyncTranslated) => {
        if (asyncTranslated !== username) {
          setTranslated(asyncTranslated);
        }
      })
      .catch((error) => {
        console.warn("Transliteration failed, using original:", error);
        // Keep sync version on error
      });
  }, [username, language]);

  return translated || username || "";
};

