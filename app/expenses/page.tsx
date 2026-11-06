"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { Loader2, Sparkles } from "lucide-react";

export default function ExpensesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="flex flex-col items-center space-y-3 text-slate-500">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm animate-spin">
            <Loader2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-rose-700">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      data-testid="expenses-page"
      className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 w-full relative"
    >
      {/* Ambient Crimson & Amber Glows */}
      <div className="absolute w-[500px] h-[500px] bg-rose-400/08 blur-[150px] rounded-full pointer-events-none top-10 left-10" />
      <div className="absolute w-[400px] h-[400px] bg-amber-400/08 blur-[140px] rounded-full pointer-events-none top-40 right-10" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-sky-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/85 border border-sky-100 text-slate-800 text-[11px] font-bold mb-2 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Arctic Frost Ledger & Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Expense Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ghi nhận giao dịch, đánh dấu ưu tiên và phân tích cấu trúc chi tiêu trong không gian băng tuyết tinh khôi.
          </p>
        </div>
      </div>

      {/* Responsive Grid: On large screens (1280px / xl), Form & Summary sit beside List */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Summary */}
        <div className="xl:col-span-5 space-y-6 order-2 xl:order-1">
          <ExpenseForm />
          <ExpenseSummary />
        </div>

        {/* Right Column: Filters & Expense List */}
        <div className="xl:col-span-7 space-y-4 order-1 xl:order-2">
          <ExpenseFilters />
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
