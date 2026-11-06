"use client";

import { useEffect, useState } from "react";

export default function AnimatedPlanet() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.6 + 0.3,
      color: Math.random() > 0.5 ? "rgba(16,185,129,0.8)" : "rgba(52,211,153,0.8)",
    }));
    setParticles(generated);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center [perspective:1200px] my-4">
      <style>{`
        @keyframes cyber-orbit-1 {
          from { transform: rotateX(75deg) rotateY(20deg) rotateZ(0deg); }
          to { transform: rotateX(75deg) rotateY(20deg) rotateZ(360deg); }
        }
        @keyframes cyber-orbit-2 {
          from { transform: rotateX(65deg) rotateY(-25deg) rotateZ(0deg); }
          to { transform: rotateX(65deg) rotateY(-25deg) rotateZ(-360deg); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(12px, -20px) scale(1.3); }
        }
        @keyframes core-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(16,185,129,0.6), inset 0 0 25px rgba(5,150,105,0.6); }
          50% { transform: scale(1.08); box-shadow: 0 0 70px rgba(16,185,129,0.9), inset 0 0 40px rgba(5,150,105,0.9); }
        }
      `}</style>

      {/* Floating Cyber Particles */}
      <div className="absolute inset-0 z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              opacity: p.opacity,
              animation: `float-particle ${p.duration}s ease-in-out infinite ${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Central Holographic Quantum Core */}
      <div 
        className="absolute w-[120px] h-[120px] rounded-full bg-gradient-to-br from-emerald-400 via-teal-600 to-emerald-900 z-10 flex items-center justify-center border-2 border-emerald-300/40" 
        style={{ animation: "core-pulse 3.5s ease-in-out infinite" }}
      >
        <div className="w-[70px] h-[70px] rounded-full bg-slate-950/70 backdrop-blur-sm flex items-center justify-center border border-emerald-400/50">
          <div className="w-5 h-5 rounded-full bg-emerald-300 shadow-[0_0_15px_#34d399]" />
        </div>
      </div>

      {/* Gyroscopic Emerald Ring */}
      <div 
        className="absolute w-[210px] h-[210px] rounded-full border-[2.5px] border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.7),inset_0_0_15px_rgba(16,185,129,0.7)] z-20"
        style={{ animation: "cyber-orbit-1 9s linear infinite" }}
      />
      
      {/* Gyroscopic Mint/Teal Ring */}
      <div 
        className="absolute w-[260px] h-[260px] rounded-full border-[2px] border-teal-300/70 shadow-[0_0_25px_rgba(20,184,166,0.6),inset_0_0_20px_rgba(20,184,166,0.6)] z-20"
        style={{ animation: "cyber-orbit-2 13s linear infinite" }}
      />
    </div>
  );
}
