"use client";

import React from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { Search, X, Star, Filter } from "lucide-react";
import { ALLOWED_CATEGORIES } from "@/lib/validations";

export function ExpenseFilters() {
  const {
    filters,
    setCategoryFilter,
    setStarredFilter,
    setSearchQuery,
    clearFilters,
  } = useExpenses();

  return (
    <div className="cloud-glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
          <Filter className="w-3.5 h-3.5 text-rose-500" />
          <span>Filters & Search</span>
        </div>
        {(filters.category !== "All" || filters.starred || filters.q) && (
          <button
            type="button"
            data-testid="btn-clear-filters"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-700 text-xs font-bold border border-rose-200/80 transition-all cursor-pointer shadow-xs hover:border-amber-300"
          >
            <X className="w-3 h-3 text-rose-500" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            data-testid="search-input"
            type="text"
            value={filters.q}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or note..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200/90 bg-white/70 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-4">
          <select
            data-testid="filter-category"
            value={filters.category}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200/90 bg-white/70 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm font-medium text-slate-900 transition-all cursor-pointer"
          >
            <option value="All" className="bg-white text-slate-900">All Categories</option>
            {ALLOWED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-white text-slate-900">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Starred Checkbox */}
        <div className="sm:col-span-3 flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              data-testid="filter-starred"
              checked={filters.starred}
              onChange={(e) => setStarredFilter(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-amber-500 border-slate-300 bg-white cursor-pointer"
            />
            <span className="flex items-center space-x-1.5">
              <Star
                className={`w-3.5 h-3.5 ${
                  filters.starred
                    ? "fill-amber-400 text-amber-500"
                    : "text-slate-400"
                }`}
              />
              <span>Starred only</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default ExpenseFilters;
