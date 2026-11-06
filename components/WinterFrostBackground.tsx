"use client";

import React from "react";

export function WinterFrostBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Glacial Winter Sky Base: Alpine Ice White -> Crystal Sky Blue -> Deep Crisp Frost */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#f0f9ff] to-[#e0f2fe] opacity-95" />

      {/* Atmospheric Glacial & Ocean Blue Ambient Orbs */}
      
      {/* Orb 1: Arctic Cyan & Glacial Teal (Top-Left) */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] sm:w-[720px] sm:h-[720px] rounded-full opacity-60 mix-blend-multiply blur-[130px] animate-cloud-pulse-slow"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(56, 189, 248, 0.20) 50%, transparent 75%)",
        }}
      />

      {/* Orb 2: Royal Ocean Blue & Cobalt Frost (Top-Right) */}
      <div
        className="absolute -top-24 -right-24 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full opacity-65 mix-blend-multiply blur-[130px] animate-cloud-drift-right"
        style={{
          background: "radial-gradient(circle, rgba(2, 132, 199, 0.35) 0%, rgba(37, 99, 235, 0.22) 50%, transparent 75%)",
        }}
      />

      {/* Orb 3: Deep Marine & Sapphire Blue (Mid-Left & Center) */}
      <div
        className="absolute top-1/3 -left-20 w-[450px] h-[450px] sm:w-[620px] sm:h-[620px] rounded-full opacity-50 mix-blend-multiply blur-[125px] animate-cloud-drift-left"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.30) 0%, rgba(30, 64, 175, 0.18) 55%, transparent 75%)",
        }}
      />

      {/* Orb 4: Pure Crystal Frost & Ice Diamond Glow (Center-Right) */}
      <div
        className="absolute top-1/2 -right-16 w-[480px] h-[480px] sm:w-[600px] sm:h-[600px] rounded-full opacity-55 mix-blend-multiply blur-[120px] animate-cloud-pulse-slow"
        style={{
          background: "radial-gradient(circle, rgba(125, 211, 252, 0.40) 0%, rgba(6, 182, 212, 0.18) 50%, transparent 75%)",
        }}
      />

      {/* Orb 5: Horizon Glacial Mist (Bottom Center) */}
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] sm:w-[1300px] sm:h-[600px] rounded-full opacity-60 mix-blend-multiply blur-[140px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(186, 230, 253, 0.45) 0%, rgba(2, 132, 199, 0.20) 45%, rgba(255, 255, 255, 0.8) 75%, transparent 100%)",
        }}
      />

      {/* Crystalline Frost Silhouette Layer (Gentle floating snow waves) */}
      <div className="absolute inset-x-0 top-0 h-[480px] opacity-35 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-[200%] sm:w-[150%] h-full animate-cloud-float-x transform -translate-x-10"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="frostGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#0284c7" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.20" />
            </linearGradient>
            <linearGradient id="frostGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#bae6fd" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.20" />
            </linearGradient>
            <filter id="frostSoftBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="15" />
            </filter>
          </defs>

          {/* Glacial Wave 1 */}
          <path
            filter="url(#frostSoftBlur)"
            fill="url(#frostGrad1)"
            d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,192C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />

          {/* Glacial Wave 2 */}
          <path
            filter="url(#frostSoftBlur)"
            fill="url(#frostGrad2)"
            d="M0,64L60,90.7C120,117,240,171,360,186.7C480,203,600,181,720,160C840,139,960,117,1080,122.7C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>

      {/* Soft Glacial Frost Ambient Flow */}

      {/* Floating Ice Crystal Sparkles (SVG Snow Stars) */}
      <div className="absolute top-16 left-1/4 w-3 h-3 text-sky-300 opacity-60 animate-pulse">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
        </svg>
      </div>
      <div className="absolute top-36 right-1/3 w-4 h-4 text-cyan-300 opacity-55 animate-pulse" style={{ animationDelay: "1.5s" }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
        </svg>
      </div>
      <div className="absolute top-64 right-16 w-3 h-3 text-blue-300 opacity-50 animate-pulse" style={{ animationDelay: "2.8s" }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
        </svg>
      </div>
      <div className="absolute top-80 left-12 w-3.5 h-3.5 text-sky-400 opacity-45 animate-pulse" style={{ animationDelay: "3.5s" }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
        </svg>
      </div>

      {/* Soft Alpine Snow Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export default WinterFrostBackground;

