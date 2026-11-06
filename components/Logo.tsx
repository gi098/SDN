"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  href?: string;
  layout?: "col" | "row";
  theme?: "light" | "dark";
}

export default function Logo({
  size = "md",
  showText = true,
  showSubtitle = true,
  title = "ReadLog",
  subtitle = "Reading Journey Tracker",
  className = "",
  href = "/",
  layout = "col",
  theme = "light",
}: LogoProps) {
  const sizeMap = {
    sm: { box: "w-9 h-9 rounded-xl", text: "text-base", sub: "text-[10px]" },
    md: { box: "w-11 h-11 rounded-2xl", text: "text-lg", sub: "text-[11px]" },
    lg: { box: "w-14 h-14 rounded-2xl", text: "text-2xl", sub: "text-xs" },
    xl: { box: "w-16 h-16 rounded-2xl", text: "text-3xl", sub: "text-sm" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Arctic Aurora Fox Logo Tile */}
      <div className="relative group shrink-0">
        <div
          className={`${currentSize.box} relative overflow-hidden border-2 border-sky-300/70 shadow-[0_4px_16px_rgba(2,132,199,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_6px_22px_rgba(6,182,212,0.55)] group-hover:border-cyan-300 bg-gradient-to-br from-[#091838] via-[#0b214d] to-[#040a18] flex items-center justify-center`}
        >
          <div className="w-full h-full relative p-0.5">
            <Image
              src="/fox-transparent.png"
              alt="Arctic Aurora Fox"
              fill
              className="object-contain object-center transform scale-110 group-hover:scale-120 transition-transform duration-500 drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
              sizes="64px"
            />
          </div>
          {/* Subtle Aurora Glaze Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-white/20 pointer-events-none" />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`flex ${layout === "row" ? "flex-row items-center gap-2" : "flex-col"}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${
                theme === "dark"
                  ? "bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(56,189,248,0.4)]"
                  : "bg-gradient-to-r from-slate-950 via-slate-800 to-sky-700 bg-clip-text text-transparent"
              } ${currentSize.text}`}
            >
              {title}
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`font-medium tracking-wide ${
                theme === "dark" ? "text-sky-200/80" : "text-slate-500"
              } ${layout === "col" ? "mt-1" : ""} ${currentSize.sub}`}
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
