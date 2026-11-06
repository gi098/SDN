"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import AnimatedFox3D from "@/components/AnimatedFox3D";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    auth?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (
    eVal = email,
    pVal = password,
    cpVal = confirmPassword
  ) => {
    const errs: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

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
    } else if (pVal.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    if (!cpVal) {
      errs.confirmPassword = "Confirm password is required";
    } else if (pVal !== cpVal) {
      errs.confirmPassword = "Passwords do not match";
    }

    return errs;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (hasSubmitted) {
      const v = validate(val, password, confirmPassword);
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
      const v = validate(email, val, confirmPassword);
      setErrors((prev) => ({
        ...prev,
        password: v.password,
        confirmPassword: v.confirmPassword,
        auth: undefined,
      }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (hasSubmitted) {
      const v = validate(email, password, val);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: v.confirmPassword,
        auth: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setSuccessMessage("");

    const clientErrs = validate();
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ auth: data.error || "Registration failed" });
      } else {
        setSuccessMessage("Registration successful");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setHasSubmitted(false);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch {
      setErrors({ auth: "Network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Split Auth Card Container */}
      <div className="w-full max-w-[960px] bg-white rounded-[32px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(2,132,199,0.2)] border border-sky-100 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Panel: Deep Ocean Night with Glowing Text & Celestial Rings */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#081226] via-[#0b1b38] to-[#040915] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden text-white select-none">
          {/* Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-500/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-400/20 blur-[80px] rounded-full pointer-events-none" />

          {/* Headline & Brand Logo */}
          <div className="relative z-10">
            <div className="mb-5 inline-block">
              <Logo theme="dark" size="sm" showSubtitle={false} href="/" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Create an <br />
              <span className="text-[#38bdf8] drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]">
                Account
              </span>
            </h2>
          </div>

          {/* 3D Animated Arctic Aurora Fox */}
          <div className="relative z-10 flex items-center justify-center my-8 sm:my-12">
            <AnimatedFox3D size="lg" interactive={true} />
          </div>

          {/* Bottom subtle text */}
          <div className="relative z-10 text-xs text-slate-400 font-medium">
            Smart & Intelligent Personal Expense Tracking
          </div>
        </div>

        {/* Right Panel: Clean White Form */}
        <div className="md:col-span-7 bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          <div className="mb-6 block md:hidden">
            <Logo size="sm" showSubtitle={false} href="/" />
          </div>
          
          {/* Register Form with data-testid="register-form" */}
          <form
            data-testid="register-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* Server / Auth Error with data-testid="error-auth" */}
            {errors.auth && (
              <div
                data-testid="error-auth"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.auth}</span>
              </div>
            )}

            {/* Success Message with data-testid="form-success" */}
            {successMessage && (
              <div
                data-testid="form-success"
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                FULL NAME
              </label>
              <input
                id="register-name"
                data-testid="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                EMAIL ADDRESS
              </label>
              <input
                id="register-email"
                data-testid="register-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
                  errors.email
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/20"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs text-rose-600 font-medium mt-1"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  PASSWORD
                </label>
                <span className="text-xs text-slate-400 font-medium">
                  Min. 6 characters
                </span>
              </div>
              <div className="relative">
                <input
                  id="register-password"
                  data-testid="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className={`w-full pl-4 pr-10 py-3 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
                    errors.password
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/20"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs text-rose-600 font-medium mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  data-testid="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={loading}
                  className={`w-full pl-4 pr-10 py-3 rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
                    errors.confirmPassword
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/20"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs text-rose-600 font-medium mt-1"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button with data-testid="register-submit" */}
            <button
              type="submit"
              data-testid="register-submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(14,165,233,0.35)] disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-6 mt-4">
            <p className="text-xs sm:text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-sky-600 font-bold hover:text-sky-700 hover:underline transition-colors ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
