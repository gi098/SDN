"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    auth?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = (eVal = email, pVal = password) => {
    const errs: { email?: string; password?: string } = {};

    const cleanEmail = eVal.trim();
    if (!cleanEmail) {
      errs.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        errs.email = "Please enter a valid email address";
      }
    }

    if (!pVal) {
      errs.password = "Password is required";
    }

    return errs;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (hasSubmitted) {
      const v = validate(val, password);
      setErrors((prev) => ({
        ...prev,
        email: v.email,
        auth: undefined,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (hasSubmitted) {
      const v = validate(email, val);
      setErrors((prev) => ({
        ...prev,
        password: v.password,
        auth: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const clientErrs = validate();
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ auth: data.error || "Invalid email or password" });
      } else {
        await checkAuth();
        router.push("/expenses");
      }
    } catch {
      setErrors({ auth: "Network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Subtle Ambient Crimson Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-rose-400/10 blur-[120px] rounded-full pointer-events-none -top-10 left-1/2 -translate-x-1/2" />
      <div className="absolute w-[300px] h-[300px] bg-amber-400/08 blur-[100px] rounded-full pointer-events-none bottom-10 right-1/4" />

      {/* Floating Compact Arctic Frost Glass Card */}
      <div className="w-full max-w-[420px] relative z-10 frost-glass rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(2,132,199,0.08)] transition-all">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="md" showSubtitle={false} className="mb-3" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sign In to ExpenseTrail
          </h2>
        </div>

        {/* Login Form with data-testid="login-form" */}
        <form
          data-testid="login-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* Server / Auth Error with data-testid="error-auth" */}
          {errors.auth && (
            <div
              data-testid="error-auth"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errors.auth}</span>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                data-testid="login-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
                  errors.email
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
                }`}
                placeholder="developer@example.com"
              />
            </div>
            {errors.email && (
              <p
                data-testid="error-email"
                className="text-[11px] text-rose-600 font-medium ml-1 mt-1"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                data-testid="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
                  errors.password
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p
                data-testid="error-password"
                className="text-[11px] text-rose-600 font-medium ml-1 mt-1"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button with data-testid="login-submit" */}
          <button
            type="submit"
            data-testid="login-submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl theme-gradient-btn text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(225,29,72,0.35)] disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-5 mt-5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-rose-600 font-bold hover:text-rose-700 hover:underline transition-colors ml-1"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
