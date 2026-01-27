import { createContext, useContext, useState, ReactNode } from "react";
import { Language, t as translate, formatDateLocalized, formatTimeLocalized, getShortWeekday, getShortMonth } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date) => string;
  getWeekday: (date: Date) => string;
  getMonth: (date: Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, defaultLang = "de" }: { children: ReactNode; defaultLang?: Language }) {
  const [lang, setLang] = useState<Language>(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("app-language");
    if (saved === "en" || saved === "de") return saved;
    return defaultLang;
  });

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("app-language", newLang);
  };

  const value: LanguageContextType = {
    lang,
    setLang: handleSetLang,
    t: (key: string) => translate(key, lang),
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => formatDateLocalized(date, lang, options),
    formatTime: (date: Date) => formatTimeLocalized(date, lang),
    getWeekday: (date: Date) => getShortWeekday(date, lang),
    getMonth: (date: Date) => getShortMonth(date, lang),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Language toggle component
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLang("de")}
        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
          lang === "de" 
            ? "bg-teal-600 text-white" 
            : "text-neutral-500 hover:bg-neutral-100"
        }`}
      >
        DE
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
          lang === "en" 
            ? "bg-teal-600 text-white" 
            : "text-neutral-500 hover:bg-neutral-100"
        }`}
      >
        EN
      </button>
    </div>
  );
}
