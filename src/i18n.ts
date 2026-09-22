import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

const storedLanguage =
  typeof localStorage !== "undefined" ? localStorage.getItem("spla3-language") : null;
const defaultLanguage =
  storedLanguage === "ja" || storedLanguage === "en"
    ? storedLanguage
    : typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("ja")
      ? "ja"
      : "en";

i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng: defaultLanguage,
  fallbackLng: "ja",
  interpolation: { escapeValue: false },
});

export default i18n;
