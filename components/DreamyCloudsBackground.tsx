"use client";

import React from "react";

export function DreamyCloudsBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Sky Base Gradient: Dawn/Twilight Sky Blue -> Radiant Sunset Amber/Orange -> Soft Sunset Rose */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9ff] via-[#fff7ed] to-[#fff1f2] opacity-90" />

      {/* Atmospheric Glowing Cloud Orbs (Red, Orange, Blue/Cyan) */}
      
      {/* Orb 1: Sunset Rose Red Cloud (Top-Left) */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] sm:w-[700px] sm:h-[700px] rounded-full opacity-60 mix-blend-multiply blur-[120px] animate-cloud-pulse-slow"
        style={{
          background: "radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(225, 29, 72, 0.25) 45%, transparent 70%)",
        }}
      />

      {/* Orb 2: Radiant Sunset Amber & Orange Cloud (Top-Right) */}
      <div
        className="absolute -top-24 -right-24 w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full opacity-65 mix-blend-multiply blur-[130px] animate-cloud-drift-right"
        style={{
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.45) 0%, rgba(251, 146, 60, 0.25) 50%, transparent 70%)",
        }}
      />

      {/* Orb 3: Twilight Sky Blue & Cyan Cloud (Mid-Left & Center) */}
      <div
        className="absolute top-1/3 -left-20 w-[450px] h-[450px] sm:w-[620px] sm:h-[620px] rounded-full opacity-55 mix-blend-multiply blur-[120px] animate-cloud-drift-left"
        style={{
          background: "radial-gradient(circle, rgba(2, 132, 199, 0.35) 0%, rgba(56, 189, 248, 0.20) 50%, transparent 70%)",
        }}
      />

      {/* Orb 4: Ethereal Sunset Coral & Violet Glow (Center-Right) */}
      <div
        className="absolute top-1/2 -right-16 w-[480px] h-[480px] sm:w-[600px] sm:h-[600px] rounded-full opacity-50 mix-blend-multiply blur-[125px] animate-cloud-pulse-slow"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.30) 0%, rgba(99, 102, 241, 0.20) 55%, transparent 75%)",
        }}
      />

      {/* Orb 5: Horizon Sunset Warm Glow (Bottom Center) */}
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] sm:w-[1200px] sm:h-[600px] rounded-full opacity-60 mix-blend-multiply blur-[140px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(251, 146, 60, 0.35) 0%, rgba(244, 63, 94, 0.25) 45%, rgba(14, 165, 233, 0.15) 75%, transparent 100%)",
        }}
      />

      {/* Fluffy Natural Cloud Silhouettes Layer 1 (Drifting gently) */}
      <div className="absolute inset-x-0 top-0 h-[480px] opacity-35 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-[200%] sm:w-[150%] h-full animate-cloud-float-x transform -translate-x-10"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#fb923c" stopOpacity="0.30" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.20" />
            </linearGradient>
            <linearGradient id="cloudGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.20" />
              <stop offset="45%" stopColor="#f97316" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#e11d48" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#fda4af" stopOpacity="0.15" />
            </linearGradient>
            <filter id="cloudSoftBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          {/* Cloud Formation Alpha */}
          <path
            filter="url(#cloudSoftBlur)"
            fill="url(#cloudGrad1)"
            d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,192C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />

          {/* Cloud Formation Beta */}
          <path
            filter="url(#cloudSoftBlur)"
            fill="url(#cloudGrad2)"
            d="M0,64L60,90.7C120,117,240,171,360,186.7C480,203,600,181,720,160C840,139,960,117,1080,122.7C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>

      {/* Delicate Twilight Stars & Shimmer Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:48px_48px] opacity-40" />

      {/* Subtle Warm Sunset Horizon Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export default DreamyCloudsBackground;

