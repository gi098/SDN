"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  href?: string;
  animate?: boolean;
  layout?: "col" | "row";
}

export default function Logo({
  size = "md",
  showText = true,
  showSubtitle = true,
  subtitle = "Workspace Intelligence",
  className = "",
  href,
  animate = true,
  layout = "col",
}: LogoProps) {
  const sizeMap = {
    sm: { box: "w-8 h-8", text: "text-base", sub: "text-[10px]", icon: "w-4 h-4" },
    md: { box: "w-10 h-10", text: "text-lg", sub: "text-[11px]", icon: "w-5 h-5" },
    lg: { box: "w-12 h-12", text: "text-2xl", sub: "text-xs", icon: "w-6 h-6" },
    xl: { box: "w-16 h-16", text: "text-3xl", sub: "text-sm", icon: "w-8 h-8" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Tech Glowing Hexagonal / Cyber Cube Icon */}
      <div className="relative group shrink-0">
        <div
          className={`${currentSize.box} relative rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-violet-600/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]`}
        >
          {/* Subtle Ambient Glow behind */}
          <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-xl" />

          {/* Futuristic Geometric Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`${currentSize.icon} relative z-10 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]`}
          >
            <path
              d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22V12"
              stroke="url(#nexus-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 7L12 12L3 7"
              stroke="url(#nexus-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
            <defs>
              <linearGradient id="nexus-grad" x1="3" y1="7" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Mini Accent Dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] ring-2 ring-[#070a12]" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`flex ${layout === "row" ? "flex-row items-center gap-2" : "flex-col"}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent ${currentSize.text}`}
            >
              NEXUS
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              SDN
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`text-slate-400 font-medium tracking-wide ${layout === "col" ? "mt-1" : ""} ${currentSize.sub}`}
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
