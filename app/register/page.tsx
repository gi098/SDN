"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, ArrowRight, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        const data = await res.json();
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Subtle Background Glow */}
      <div className="absolute w-[380px] h-[380px] bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none -top-10 left-1/2 -translate-x-1/2" />

      {/* Floating Compact Cyber Card */}
      <div className="w-full max-w-[440px] relative z-10 bg-[#08101e]/90 backdrop-blur-2xl border border-white/10 hover:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.12)] transition-all">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <Logo size="md" showSubtitle={false} className="mb-2.5" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Create Nexus Account
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Join your workspace team & track sprints in real time
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#050a12]/80 focus:bg-[#050a12] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 transition-all"
                placeholder="Alex Nguyen"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#050a12]/80 focus:bg-[#050a12] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 transition-all"
                placeholder="developer@example.com"
              />
            </div>
          </div>

          {/* Password & Confirm Password (2-col or compact stack) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-7 py-2.5 rounded-xl border border-white/10 bg-[#050a12]/80 focus:bg-[#050a12] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Confirm
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-white/10 bg-[#050a12]/80 focus:bg-[#050a12] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-xl theme-gradient-btn text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 mt-4 border-t border-white/5">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-colors ml-1"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
