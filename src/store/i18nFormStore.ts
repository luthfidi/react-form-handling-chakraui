import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  LanguageCode,
  availableLanguages,
} from "../schemas/internationalizationSchema";

interface I18nFormState {
  // Currently selected language
  currentLanguage: LanguageCode;
  // Set language
  setLanguage: (language: LanguageCode) => void;
  // Get browser's preferred language if available
  detectBrowserLanguage: () => void;
}

export const useI18nFormStore = create<I18nFormState>()(
  persist(
    (set) => ({
      // Default language is English
      currentLanguage: "en",

      // Set language
      setLanguage: (language: LanguageCode) =>
        set({ currentLanguage: language }),

      // Detect browser language
      detectBrowserLanguage: () => {
        const browserLanguages = navigator.languages || [navigator.language];

        for (const browserLang of browserLanguages) {
          // Get the first 2 characters (language code)
          const langCode = browserLang.substring(0, 2).toLowerCase();

          // Check if we support this language
          const isSupported = availableLanguages.some(
            (lang) => lang.code === langCode
          );

          if (isSupported) {
            set({ currentLanguage: langCode as LanguageCode });
            return;
          }
        }

        // Fallback to English if no supported language is found
        set({ currentLanguage: "en" });
      },
    }),
    {
      name: "i18n-form-language", // localStorage key
    }
  )
);
