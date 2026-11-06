"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wallet,
  PieChart,
  Star,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] relative overflow-hidden">
      {/* Ambient Crimson & Champagne Halos */}
      <div className="absolute w-[600px] h-[600px] bg-rose-400/10 blur-[150px] rounded-full pointer-events-none -top-24 left-1/2 -translate-x-1/2" />
      <div className="absolute w-[450px] h-[450px] bg-red-500/08 blur-[140px] rounded-full pointer-events-none top-96 -left-20" />
      <div className="absolute w-[450px] h-[450px] bg-amber-400/08 blur-[140px] rounded-full pointer-events-none top-80 -right-20" />

      {/* Hero Section */}
      <section className="relative z-10 py-16 sm:py-24 lg:py-28 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Intelligent Financial Tracking & Analytics</span>
        </div>

        {/* Hero Title */}
        <h1
          data-testid="home-title"
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight"
        >
          <span className="theme-gradient-text drop-shadow-[0_4px_25px_rgba(225,29,72,0.18)]">
            ExpenseTrail
          </span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 font-medium leading-relaxed mb-8">
          A high-performance personal expense tracking architecture connected to
          cloud PostgreSQL. Seamlessly log transactions, organize into categories,
          star priority records, and observe real-time analytical breakdowns.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {!loading && user ? (
            <Link
              href="/expenses"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl theme-gradient-btn text-white text-sm font-bold shadow-[0_4px_20px_rgba(225,29,72,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Go to My Expenses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : !loading ? (
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl theme-gradient-btn text-white text-sm font-bold shadow-[0_4px_20px_rgba(225,29,72,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold shadow-xs transition-all"
              >
                <span>Sign In</span>
              </Link>
            </>
          ) : null}
        </div>
      </section>

      {/* Feature Cards Section (at least 3 cards) */}
      <section className="relative z-10 py-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Financial Mastery
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Streamlined controls with uncompromising security and real-time synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="luxury-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-rose-300 transition-all duration-300 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Categorization</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log expenditures into Food, Transport, Bills, Shopping, and Other. Instant multi-faceted category filtering with zero friction.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-rose-600">
              <span>Automatic categorization engine</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="luxury-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-300 transition-all duration-300 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">One-Click Star Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bookmark recurring payments, crucial bills, or priority records with intuitive one-touch star toggles and dedicated star filters.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-600">
              <span>Instant shortlist filtering</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="luxury-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-red-300 transition-all duration-300 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Analytics Summary</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Live statistics covering total amount, transaction counts, starred metrics, and dynamic category breakdowns with priority ranking.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-red-600">
              <span>Dynamic adaptive summaries</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
