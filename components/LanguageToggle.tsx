"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-xl bg-slate-900 border border-white/10" />
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      title={language === "en" ? "Chuyển sang Tiếng Việt" : "Switch to English"}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 border bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/10 hover:border-emerald-500/40"
    >
      <Globe className="w-3.5 h-3.5 text-emerald-400 transition-transform hover:rotate-45" />

      <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide">
        <span
          className={`transition-colors ${
            language === "en" ? "text-emerald-400 font-black" : "text-slate-500 font-medium"
          }`}
        >
          EN
        </span>
        <span className="text-slate-600 text-[10px]">/</span>
        <span
          className={`transition-colors ${
            language === "vi" ? "text-emerald-400 font-black" : "text-slate-500 font-medium"
          }`}
        >
          VI
        </span>
      </span>
    </button>
  );
}
