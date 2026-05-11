import { useEffect } from "react";
import {
  useAuthContext,
  useLanguage,
  LANGUAGE_USER_PICKED_KEY,
  type Language,
} from "@providers";
import { UserService } from "@services";
import {
  GEO_LANGUAGE_INIT_KEY,
  PROFILE_LANGUAGE_API_SYNC_KEY,
  countryCodeToLanguage,
  fetchCountryCode,
} from "@utils";

/**
 * First visit: detect country, set UI language, then PUT /profile/language when logged in.
 * Urdu-region users get en; unknown countries default to en. Syncs profile when token appears later.
 */
export const GeoLanguageSync = () => {
  const { language, setLanguage } = useLanguage();
  const { token } = useAuthContext();

  useEffect(() => {
    const syncProfileLanguage = async (lang: Language) => {
      if (!token) return;
      if (localStorage.getItem(PROFILE_LANGUAGE_API_SYNC_KEY) === "1") return;
      try {
        await UserService.updateProfileLanguage({ language: lang });
        localStorage.setItem(PROFILE_LANGUAGE_API_SYNC_KEY, "1");
      } catch {
        // Non-fatal: geo still applied; user can change language in settings later.
      }
    };

    let cancelled = false;

    const runGeo = async () => {
      if (localStorage.getItem(GEO_LANGUAGE_INIT_KEY) === "1") return;

      /** User chose a language in the dropdown; do not apply geo (still mark geo pass as done). */
      if (localStorage.getItem(LANGUAGE_USER_PICKED_KEY) === "1") {
        localStorage.setItem(GEO_LANGUAGE_INIT_KEY, "1");
        return;
      }

      let country: string | null = null;
      try {
        country = await fetchCountryCode();
      } catch {
        country = null;
      }
      if (cancelled) return;
      if (localStorage.getItem(GEO_LANGUAGE_INIT_KEY) === "1") return;
      if (localStorage.getItem(LANGUAGE_USER_PICKED_KEY) === "1") {
        localStorage.setItem(GEO_LANGUAGE_INIT_KEY, "1");
        return;
      }

      const lang = countryCodeToLanguage(country);
      setLanguage(lang);
      localStorage.setItem(GEO_LANGUAGE_INIT_KEY, "1");
      await syncProfileLanguage(lang);
    };

    const run = async () => {
      if (localStorage.getItem(GEO_LANGUAGE_INIT_KEY) !== "1") {
        await runGeo();
        return;
      }
      await syncProfileLanguage(language);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [language, setLanguage, token]);

  return null;
};
