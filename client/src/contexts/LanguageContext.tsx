import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import enMessages from "@/i18n/locales/en.json";
import arMessages from "@/i18n/locales/ar.json";

type Language = "en" | "ar";

type Messages = typeof enMessages;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Translate inline bilingual object: t({ en: "Home", ar: "الرئيسية" }) */
  t: (key: Record<string, string> | string, vars?: Record<string, string | number>) => string;
  isRTL: boolean;
  dir: "ltr" | "rtl";
  messages: Messages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "sheikh-ammar-locale";

function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const result = path.split(".").reduce((acc: any, key: string) => acc?.[key], obj);
  return typeof result === "string" ? result : undefined;
}

function interpolate(value: string, vars?: Record<string, string | number>): string {
  if (!vars) return value;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
    value
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "ar" || stored === "en" ? stored : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", lang === "ar");
    document.body.classList.toggle("ltr", lang === "en");
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", language === "ar");
    document.body.classList.toggle("ltr", language === "en");
  }, [language]);

  const messages = useMemo(
    () => (language === "ar" ? (arMessages as Messages) : (enMessages as Messages)),
    [language]
  );

  const t = (key: Record<string, string> | string, vars?: Record<string, string | number>): string => {
    // Inline object: t({ en: "...", ar: "..." })
    if (typeof key === "object") {
      return key[language] || key.en || "";
    }
    // String key lookup in JSON: t("common.viewDetails")
    const value = getNestedValue(messages as unknown as Record<string, any>, key);
    if (value !== undefined) return interpolate(value, vars);
    // Fallback to English
    const fallback = getNestedValue(enMessages as unknown as Record<string, any>, key);
    if (fallback !== undefined) return interpolate(fallback, vars);
    return key;
  };

  const isRTL = language === "ar";

  const value = useMemo(
    () => ({ language, setLanguage, t, isRTL, dir: isRTL ? "rtl" as const : "ltr" as const, messages }),
    [language, isRTL, messages]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
