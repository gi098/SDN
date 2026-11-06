"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/teams");
        router.refresh();
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
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/20 via-teal-600/20 to-transparent blur-[70px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-green-600/20 to-emerald-500/10 blur-[60px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />
          
          <div className="relative z-10">
            <Logo size="lg" subtitle="Next-Gen Task Platform" />
          </div>

          <div className="relative z-10 space-y-4 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              Secure Enterprise Gateway
            </div>
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
              Access your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">intelligent</span> workspace.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Real-time collaboration, task tracking, and role-based permissions powered by PostgreSQL & Supabase.
            </p>
          </div>

          <div className="relative z-10 text-xs text-slate-500 font-mono">
            NEXUS OS · VERSION 2.0
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
          <div className="w-full max-w-md space-y-7 relative z-10">
            
            {/* Header */}
            <div>
              <div className="lg:hidden mb-6">
                <Logo size="md" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Sign In</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your credentials to manage tasks and workspaces.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 rounded-xl theme-gradient-btn text-white font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                Don't have an account yet?{" "}
                <Link href="/register" className="text-emerald-400 font-bold hover:underline transition-all">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
