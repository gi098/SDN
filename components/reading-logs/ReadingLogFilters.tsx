"use client";

import React from "react";
import { useReadingLogs } from "@/contexts/ReadingLogContext";
import { ALLOWED_GENRES } from "@/lib/types";
import { Search, Filter, Star, X } from "lucide-react";

export function ReadingLogFilters() {
  const { filters, setGenre, setIsFavorite, setSearch, clearFilters } = useReadingLogs();

  const hasActiveFilters =
    filters.genre !== "all" || filters.isFavorite || filters.search.trim() !== "";

  return (
    <div className="frost-glass rounded-3xl p-5 border border-sky-100 shadow-[0_8px_30px_rgba(2,132,199,0.06)] space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="reading-search-input"
            data-testid="search-input"
            type="text"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search book title or notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Genre Filter */}
        <div className="sm:col-span-3">
          <select
            id="filter-genre"
            data-testid="filter-genre"
            value={filters.genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs sm:text-sm font-bold text-slate-700 transition-all cursor-pointer"
          >
            <option value="all">All Genres</option>
            {ALLOWED_GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Favorite Star Filter & Clear */}
        <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-2">
          <button
            type="button"
            data-testid="filter-favorite"
            onClick={() => setIsFavorite(!filters.isFavorite)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              filters.isFavorite
                ? "bg-amber-50 border-amber-300 text-amber-700 shadow-xs"
                : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                filters.isFavorite ? "fill-amber-500 text-amber-500" : "text-slate-400"
              }`}
            />
            <span>Favorites</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              data-testid="btn-clear-filters"
              onClick={clearFilters}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

