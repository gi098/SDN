"use client";

import React from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { DollarSign, ListOrdered, Star, PieChart } from "lucide-react";

export function ExpenseSummary() {
  const { summary } = useExpenses();

  const count = summary?.count ?? 0;
  const starredCount = summary?.starredCount ?? 0;
  const totalAmount = summary?.totalAmount ?? 0;
  const breakdown = summary?.breakdown ?? [];

  return (
    <div className="space-y-4">
      {/* 3 Stat Cards (Dreamy Sunset Red, Orange, Sky Blue Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Expenses (Sunset Rose Red) */}
        <div className="cloud-glass rounded-2xl p-4 sm:p-5 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-bold text-rose-600/80 uppercase tracking-widest">
              Total Expenses
            </p>
            <h4
              data-testid="total-amount"
              className="text-xl sm:text-2xl font-black text-slate-900 mt-1"
            >
              ${totalAmount.toFixed(2)}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(244,63,94,0.35)] group-hover:scale-105 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Entries (Radiant Amber Orange) */}
        <div className="cloud-glass rounded-2xl p-4 sm:p-5 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest">
              Total Entries
            </p>
            <h4
              data-testid="expense-count"
              className="text-xl sm:text-2xl font-black text-slate-900 mt-1"
            >
              {count}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,0.35)] group-hover:scale-105 transition-transform">
            <ListOrdered className="w-5 h-5" />
          </div>
        </div>

        {/* Starred Count (Twilight Sky Blue) */}
        <div className="cloud-glass rounded-2xl p-4 sm:p-5 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-bold text-sky-600/80 uppercase tracking-widest">
              Starred Items
            </p>
            <h4
              data-testid="starred-count"
              className="text-xl sm:text-2xl font-black text-amber-600 mt-1"
            >
              {starredCount}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(2,132,199,0.35)] group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
          </div>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="cloud-glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-sky-600 bg-clip-text text-transparent">
            <PieChart className="w-4 h-4 text-rose-500" />
            <span>Category Breakdown</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            {breakdown.length} {breakdown.length === 1 ? "category" : "categories"}
          </span>
        </div>

        <div data-testid="category-breakdown" className="space-y-2.5">
          {breakdown.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2 text-center">
              No category data for current filter
            </p>
          ) : (
            breakdown.map((item) => {
              const percentage =
                totalAmount > 0
                  ? Math.round((item.total / totalAmount) * 100)
                  : 0;

              return (
                <div
                  key={item.category}
                  data-testid="breakdown-row"
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white/70 border border-white/80 text-xs sm:text-sm gap-2 hover:border-amber-300 transition-all shadow-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      data-testid="breakdown-name"
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 shadow-2xs"
                    >
                      {item.category}
                    </span>
                    <span
                      data-testid="breakdown-count"
                      className="text-slate-500 text-xs"
                    >
                      ({item.count} {item.count === 1 ? "expense" : "expenses"})
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="hidden sm:block w-24 h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 font-semibold min-w-8 text-right">
                      {percentage}%
                    </span>
                    <span
                      data-testid="breakdown-total"
                      className="font-bold text-slate-900 min-w-16 text-right"
                    >
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseSummary;
