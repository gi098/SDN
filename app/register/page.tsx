"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        toast.success("Registration successful! Please login.");
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
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl bg-[#0c1222]/90 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10">
        
        {/* Left Side: Brand Panel */}
        <div className="hidden lg:flex w-5/12 bg-slate-950/80 relative p-12 flex-col justify-between overflow-hidden border-r border-white/10">
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-transparent blur-[70px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-violet-600/20 to-cyan-500/10 blur-[60px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />
          
          <div className="relative z-10">
            <Logo size="lg" subtitle="Next-Gen Task Platform" />
          </div>

          <div className="relative z-10 space-y-4 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
              <ShieldCheck className="w-4 h-4" />
              Member Onboarding
            </div>
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
              Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">developer</span> profile.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join your engineering team, track sprints, and stay in sync in real time.
            </p>
          </div>

          <div className="relative z-10 text-xs text-slate-500 font-mono">
            NEXUS OS · VERSION 2.0
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
          <div className="w-full max-w-md space-y-6 relative z-10">
            
            {/* Header */}
            <div>
              <div className="lg:hidden mb-6">
                <Logo size="md" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Account</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your details to register a new workspace account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <span className="text-[10px] font-medium text-slate-500">Min. 6 characters</span>
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 rounded-xl theme-gradient-btn text-white font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-400 font-bold hover:underline transition-all">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
