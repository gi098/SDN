"use client";

import React from "react";
import { useReadingLogs } from "@/contexts/ReadingLogContext";
import { BookOpen, Clock, Star, PieChart } from "lucide-react";

export function ReadingLogSummary() {
  const { summary, loading } = useReadingLogs();

  const totalSessions = summary?.totalSessions ?? 0;
  const totalMinutes = summary?.totalMinutes ?? 0;
  const favoriteCount = summary?.favoriteCount ?? 0;
  const breakdown = summary?.genreBreakdown ?? [];

  return (
    <div className="space-y-6">
      {/* 3 Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sessions */}
        <div className="frost-glass rounded-3xl p-5 border border-sky-100 shadow-[0_8px_30px_rgba(2,132,199,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Sessions
            </span>
            <span data-testid="total-sessions" className="text-2xl font-black text-slate-900">
              {loading ? "..." : totalSessions}
            </span>
          </div>
        </div>

        {/* Total Minutes */}
        <div className="frost-glass rounded-3xl p-5 border border-sky-100 shadow-[0_8px_30px_rgba(2,132,199,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Minutes
            </span>
            <div className="flex items-baseline gap-1">
              <span data-testid="total-minutes" className="text-2xl font-black text-slate-900">
                {loading ? "..." : totalMinutes}
              </span>
              <span className="text-xs font-semibold text-slate-500">mins</span>
            </div>
          </div>
        </div>

        {/* Favorite Sessions */}
        <div className="frost-glass rounded-3xl p-5 border border-sky-100 shadow-[0_8px_30px_rgba(2,132,199,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Favorites
            </span>
            <span data-testid="favorite-count" className="text-2xl font-black text-slate-900">
              {loading ? "..." : favoriteCount}
            </span>
          </div>
        </div>
      </div>

      {/* Genre Breakdown Card */}
      <div
        data-testid="genre-breakdown"
        className="frost-glass rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-[0_12px_40px_rgba(2,132,199,0.08)]"
      >
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-sky-100">
          <PieChart className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Genre Reading Distribution
          </h3>
        </div>

        {breakdown.length === 0 || breakdown.every((b) => b.count === 0) ? (
          <p className="text-xs text-slate-500 py-3 text-center">
            No reading activity recorded yet.
          </p>
        ) : (
          <div className="space-y-3.5">
            {breakdown
              .filter((b) => b.count > 0)
              .map((b) => (
                <div
                  key={b.genre}
                  data-testid="breakdown-row"
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span data-testid="breakdown-name" className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                      {b.genre}
                    </span>
                    <div className="flex items-center gap-3">
                      <span data-testid="breakdown-count" className="text-slate-500 font-medium">
                        {b.count} {b.count === 1 ? "session" : "sessions"}
                      </span>
                      <span data-testid="breakdown-total" className="text-slate-900 font-extrabold">
                        {b.totalMinutes} mins
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
