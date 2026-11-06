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
  Snowflake,
} from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 py-16 sm:py-24 lg:py-28 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Arctic Frost & Winter Ocean Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/85 border border-sky-100 text-slate-800 text-xs font-bold mb-6 shadow-[0_4px_20px_rgba(2,132,199,0.12)] backdrop-blur-md">
          <Snowflake className="w-4 h-4 text-sky-500 animate-spin-slow" />
          <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Arctic Frost Edition · Băng Tuyết & Biển Xanh Tinh Khiết
          </span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </div>

        {/* Hero Title with data-testid="home-title" */}
        <h1
          data-testid="home-title"
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight"
        >
          <span className="theme-gradient-text drop-shadow-[0_6px_35px_rgba(2,132,199,0.22)]">
            ExpenseTrail
          </span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 font-medium leading-relaxed mb-8">
          Hệ sinh thái quản lý chi tiêu cá nhân trong trẻo và chuẩn mực như pha lê tuyết trắng.
          Ghi nhận giao dịch mượt mà, phân loại danh mục thông minh, đánh dấu ưu tiên và theo dõi dòng tiền minh bạch tuyệt đối.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {!loading && user ? (
            <Link
              href="/expenses"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl theme-gradient-btn text-white text-sm font-bold shadow-[0_6px_25px_rgba(2,132,199,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl theme-gradient-btn text-white text-sm font-bold shadow-[0_6px_25px_rgba(2,132,199,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                data-testid="btn-login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-white border border-sky-100 text-slate-800 text-sm font-bold shadow-xs hover:border-sky-300 transition-all backdrop-blur-md"
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
