"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface AnimatedFox3DProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showRings?: boolean;
  interactive?: boolean;
}

export function AnimatedFox3D({
  size = "md",
  className = "",
  showRings = true,
  interactive = true,
}: AnimatedFox3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-36 h-36 sm:w-44 sm:h-44",
    xl: "w-48 h-48 sm:w-56 sm:h-56",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Calculate 3D tilt angles (max +/- 18 degrees)
    const rotateY = (x / (rect.width / 2)) * 18;
    const rotateX = -(y / (rect.height / 2)) * 18;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
      setRotate({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex items-center justify-center [perspective:1000px] ${sizeClasses[size]} ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* 3D Transform Stage */}
      <div
        className="w-full h-full relative flex items-center justify-center transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.06, 1.06, 1.06)`
            : "none",
        }}
      >
        {/* Ambient 3D Levitation Wrapper */}
        <div className={`w-full h-full relative flex items-center justify-center [transform-style:preserve-3d] ${isHovered ? "" : "animate-fox-3d-float"}`}>
          
          {/* Back Glow Nebula (Layer -1 in 3D) */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-sky-400/25 to-blue-600/30 blur-xl pointer-events-none"
            style={{ transform: "translateZ(-20px)" }}
          />

          {showRings && (
            <>
              {/* Outer 3D Aurora Ring (Spinning in 3D Space) */}
              <div
                className="absolute -inset-4 sm:-inset-6 rounded-full border-[2.5px] border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.7),inset_0_0_15px_rgba(34,211,238,0.4)] pointer-events-none animate-ring-spin-slow"
                style={{
                  transform: "rotateX(68deg) rotateZ(25deg) translateZ(-5px)",
                  transformStyle: "preserve-3d",
                }}
              />

              {/* Inner 3D Violet / Cyan Counter-Orbital Ring */}
              <div
                className="absolute -inset-2 sm:-inset-4 rounded-full border-[2px] border-sky-300/70 shadow-[0_0_18px_rgba(125,211,252,0.6)] pointer-events-none animate-ring-spin-reverse"
                style={{
                  transform: "rotateX(-58deg) rotateY(20deg) translateZ(10px)",
                  transformStyle: "preserve-3d",
                }}
              />

              {/* Orbiting Stardust Particles (Floating at different 3D depths) */}
              <div
                className="absolute -top-3 right-2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] animate-pulse"
                style={{ transform: "translateZ(35px)" }}
              />
              <div
                className="absolute bottom-1 -left-2 w-2.5 h-2.5 rounded-full bg-sky-300 shadow-[0_0_12px_#7dd3fc] animate-pulse"
                style={{ transform: "translateZ(45px)", animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 -right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse"
                style={{ transform: "translateZ(55px)", animationDelay: "2s" }}
              />
            </>
          )}

          {/* Central 3D Arctic Fox Luminous Orb */}
          <div
            className="w-full h-full rounded-full relative overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.5),0_0_60px_rgba(2,132,199,0.35)] border-2 border-cyan-300/60 bg-[#061224] flex items-center justify-center"
            style={{
              transform: "translateZ(20px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Arctic Fox Image with Feathered Radial Vignette */}
            <div
              className="w-full h-full relative"
              style={{
                WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 72%, transparent 98%)",
                maskImage: "radial-gradient(circle at 50% 50%, black 72%, transparent 98%)",
              }}
            >
              <Image
                src="/fox.jpg"
                alt="Arctic Aurora Fox"
                fill
                priority
                className="object-cover object-center transform scale-110 hover:scale-115 transition-transform duration-500"
                sizes="(max-width: 768px) 160px, 240px"
              />
            </div>

            {/* Frost Crystalline Glaze Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-white/20 pointer-events-none rounded-full"
              style={{ transform: "translateZ(10px)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedFox3D;

