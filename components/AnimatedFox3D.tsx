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
    lg: "w-44 h-44 sm:w-52 sm:h-52",
    xl: "w-56 h-56 sm:w-64 sm:h-64",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // 3D perspective tilt angles
    const rotateY = (x / (rect.width / 2)) * 20;
    const rotateX = -(y / (rect.height / 2)) * 20;
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
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.08, 1.08, 1.08)`
            : "none",
        }}
      >
        {/* Ambient 3D Floating Cycle */}
        <div
          className={`w-full h-full relative flex items-center justify-center [transform-style:preserve-3d] ${
            isHovered ? "" : "animate-fox-3d-float"
          }`}
        >
          {/* Luminous Celestial Halo (Back Layer) */}
          <div
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-400/25 via-sky-400/20 to-blue-600/25 blur-2xl pointer-events-none"
            style={{ transform: "translateZ(-25px)" }}
          />

          {showRings && (
            <>
              {/* Outer 3D Aurora Ring (Spinning around the fox) */}
              <div
                className="absolute -inset-3 sm:-inset-5 rounded-full border-[2.5px] border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.7),inset_0_0_15px_rgba(34,211,238,0.4)] pointer-events-none animate-ring-spin-slow"
                style={{
                  transform: "rotateX(68deg) rotateZ(25deg) translateZ(-5px)",
                  transformStyle: "preserve-3d",
                }}
              />

              {/* Inner 3D Counter-Rotating Celestial Ring */}
              <div
                className="absolute -inset-1 sm:-inset-3 rounded-full border-[2px] border-sky-300/70 shadow-[0_0_18px_rgba(125,211,252,0.6)] pointer-events-none animate-ring-spin-reverse"
                style={{
                  transform: "rotateX(-58deg) rotateY(20deg) translateZ(10px)",
                  transformStyle: "preserve-3d",
                }}
              />
            </>
          )}

          {/* Transparent Arctic Aurora Fox (Floating in 3D Space without background) */}
          <div
            className="w-full h-full relative flex items-center justify-center drop-shadow-[0_15px_25px_rgba(6,182,212,0.35)]"
            style={{
              transform: "translateZ(25px)",
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src="/fox-transparent.png"
              alt="Arctic Aurora Fox (Transparent)"
              fill
              priority
              className="object-contain object-center transform transition-transform duration-300"
              sizes="(max-width: 768px) 180px, 260px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedFox3D;
