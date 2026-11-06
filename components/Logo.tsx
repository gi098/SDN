"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  href?: string;
  layout?: "col" | "row";
}

export default function Logo({
  size = "md",
  showText = true,
  showSubtitle = true,
  title = "ExpenseTrail",
  subtitle = "Personal Expense Tracker",
  className = "",
  href = "/",
  layout = "col",
}: LogoProps) {
  const sizeMap = {
    sm: { box: "w-8 h-8 rounded-lg", text: "text-base", sub: "text-[10px]", icon: "w-4 h-4" },
    md: { box: "w-10 h-10 rounded-xl", text: "text-lg", sub: "text-[11px]", icon: "w-5 h-5" },
    lg: { box: "w-12 h-12 rounded-2xl", text: "text-2xl", sub: "text-xs", icon: "w-6 h-6" },
    xl: { box: "w-16 h-16 rounded-2xl", text: "text-3xl", sub: "text-sm", icon: "w-8 h-8" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Glacial Ocean & Arctic Frost Icon Tile (Crisp 3D Diamond Cube) */}
      <div className="relative group shrink-0">
        <div
          className={`${currentSize.box} relative bg-gradient-to-br from-sky-400 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_4px_18px_rgba(2,132,199,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_24px_rgba(6,182,212,0.5)]`}
        >
          {/* Crisp Geometric Finance Cube / Diamond Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`${currentSize.icon} text-white drop-shadow-xs`}
          >
            <path
              d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 7L12 12L3 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`flex ${layout === "row" ? "flex-row items-center gap-2" : "flex-col"}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-sky-700 bg-clip-text text-transparent ${currentSize.text}`}
            >
              {title}
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`text-slate-500 font-medium tracking-wide ${layout === "col" ? "mt-1" : ""} ${currentSize.sub}`}
            >
              {layout === "row" ? `· ${subtitle}` : subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        {content}
      </Link>
    );
  }

  return content;
}
