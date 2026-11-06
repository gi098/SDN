"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wallet,
  PieChart,
  Star,
  ArrowRight,
  Layers,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import AnimatedFox3D from "@/components/AnimatedFox3D";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] relative overflow-hidden">
      {/* Hero Section: Modern 2-Column Split Showcase */}
      <section className="relative z-10 pt-10 sm:pt-14 lg:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Hero Title with data-testid="home-title" */}
            <h1
              data-testid="home-title"
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-2xl"
            >
              Smart Money Flow with{" "}
              <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(2,132,199,0.25)] block sm:inline">
                ExpenseTrail
              </span>
            </h1>

            {/* Hero Description */}
            <p className="max-w-xl text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              Hệ sinh thái quản lý tài chính cá nhân tinh gọn, hiện đại và chuẩn xác.
              Theo dõi chi tiêu thời gian thực, tự động phân nhóm và đánh dấu ưu tiên với trải nghiệm mượt mà không độ trễ.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
              {!loading && user ? (
                <Link
                  href="/expenses"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl theme-gradient-btn text-white text-sm font-bold shadow-[0_8px_30px_rgba(2,132,199,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Go to My Expenses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : !loading ? (
                <>
                  <Link
                    href="/register"
                    data-testid="btn-register"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl theme-gradient-btn text-white text-sm font-bold shadow-[0_8px_30px_rgba(2,132,199,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    data-testid="btn-login"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/95 hover:bg-white border border-sky-100 text-slate-800 text-sm font-bold shadow-[0_4px_20px_rgba(2,132,199,0.06)] hover:border-sky-300 hover:shadow-md transition-all backdrop-blur-md"
                  >
                    <span>Sign In</span>
                  </Link>
                </>
              ) : null}
            </div>

            {/* Value Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-sky-100 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Bảo mật JWT Cookie</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-sky-100 shadow-xs">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Đồng bộ tức thì</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-sky-100 shadow-xs">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Theo dõi Starred</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Arctic Fox Floating Glass Showcase */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="w-full max-w-[420px] aspect-square rounded-[36px] bg-gradient-to-b from-[#081329] via-[#0b1c3b] to-[#040a18] p-8 relative flex items-center justify-center shadow-[0_30px_70px_-15px_rgba(2,132,199,0.35)] border border-sky-200/20 overflow-hidden select-none group">
              
              {/* Internal Aurora Glaze */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-sky-500/20 blur-[70px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-cyan-400/20 blur-[70px] rounded-full pointer-events-none" />

              {/* Top Floating Glass Badge */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-[11px] font-bold text-white shadow-lg">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real-Time Tracker</span>
              </div>

              {/* Bottom Floating Glass Badge */}
              <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-[11px] font-bold text-white shadow-lg">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Aurora Fox Edition</span>
              </div>

              {/* 3D Interactive Fox */}
              <AnimatedFox3D size="xl" interactive={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Bento Section */}
      <section className="relative z-10 py-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Financial Mastery
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Sự kết hợp giữa vẻ đẹp băng tuyết tinh khôi và năng lực đồng bộ đám mây thời gian thực mạnh mẽ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Arctic Cyan & Ice Blue */}
          <div className="frost-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(6,182,212,0.35)] group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Categorization</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Phân loại chi tiêu tự động vào Food, Transport, Bills, Shopping và Other. Tìm kiếm và lọc đa chiều không độ trễ.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-sky-100 flex items-center text-xs font-semibold text-cyan-600">
              <span>Automatic categorization engine</span>
            </div>
          </div>

          {/* Card 2: Royal Ocean Blue */}
          <div className="frost-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(2,132,199,0.35)] group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 fill-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">One-Click Star Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Đánh dấu các khoản chi định kỳ, hóa đơn thiết yếu hoặc chi phí ưu tiên chỉ với 1 chạm cùng bộ lọc Starred tức thì.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-sky-100 flex items-center text-xs font-semibold text-sky-600">
              <span>Instant shortlist filtering</span>
            </div>
          </div>

          {/* Card 3: Deep Glacial Navy & Cobalt */}
          <div className="frost-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(37,99,235,0.35)] group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Analytics Summary</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Báo cáo tổng quan thời gian thực gồm tổng tiền, số lượng giao dịch, mục đánh dấu sao và cơ cấu chi tiêu trực quan.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-sky-100 flex items-center text-xs font-semibold text-blue-600">
              <span>Dynamic adaptive summaries</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
