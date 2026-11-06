"use client";

import React, { useState } from "react";
import { useReadingLogs } from "@/contexts/ReadingLogContext";
import { ALLOWED_GENRES, Genre } from "@/lib/types";
import { BookOpen, Clock, Calendar, Bookmark, FileText, Plus, Loader2, CheckCircle2 } from "lucide-react";

export function ReadingLogForm() {
  const { addLog } = useReadingLogs();

  const [bookTitle, setBookTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [genre, setGenre] = useState<Genre>("Fiction");
  const [readAt, setReadAt] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [errors, setErrors] = useState<{
    bookTitle?: string;
    minutes?: string;
    genre?: string;
    readAt?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!bookTitle.trim()) {
      errs.bookTitle = "Book title is required";
    }
    const minsNum = Number(minutes);
    if (!minutes || isNaN(minsNum) || !Number.isInteger(minsNum) || minsNum <= 0) {
      errs.minutes = "Minutes must be a positive integer";
    }
    if (!genre) {
      errs.genre = "Genre is required";
    }
    if (!readAt) {
      errs.readAt = "Date is required";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrs = validate();
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setErrors({});
    setLoading(true);
    setSuccess(false);

    const res = await addLog({
      bookTitle: bookTitle.trim(),
      minutes: Number(minutes),
      genre,
      readAt: new Date(readAt),
      notes: notes.trim(),
      isFavorite,
    });

    setLoading(false);

    if (!res.success) {
      setErrors({ general: res.error || "Failed to add session" });
    } else {
      setSuccess(true);
      setBookTitle("");
      setMinutes("");
      setNotes("");
      setIsFavorite(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div
      data-testid="log-form"
      className="frost-glass rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-[0_12px_40px_rgba(2,132,199,0.08)]"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-md">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Log Reading Session
          </h2>
          <p className="text-xs text-slate-500">Record minutes and book insights</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.general && (
          <div
            data-testid="error-log"
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold"
          >
            {errors.general}
          </div>
        )}

        {success && (
          <div
            data-testid="form-success"
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Reading session logged successfully!</span>
          </div>
        )}

        {/* Book Title */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
            Book Title *
          </label>
          <div className="relative">
            <input
              id="log-book-title"
              data-testid="input-title"
              type="text"
              value={bookTitle}
              onChange={(e) => {
                setBookTitle(e.target.value);
                if (errors.bookTitle) setErrors((prev) => ({ ...prev, bookTitle: undefined }));
              }}
              placeholder="e.g. Atomic Habits, Clean Code"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all"
            />
          </div>
          {errors.bookTitle && (
            <p data-testid="error-title" className="text-xs text-rose-600 font-medium mt-1">
              {errors.bookTitle}
            </p>
          )}
        </div>

        {/* Reading Minutes and Genre (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Reading Time (Minutes) *
            </label>
            <div className="relative">
              <input
                id="log-minutes"
                data-testid="input-minutes"
                type="number"
                min="1"
                step="1"
                value={minutes}
                onChange={(e) => {
                  setMinutes(e.target.value);
                  if (errors.minutes) setErrors((prev) => ({ ...prev, minutes: undefined }));
                }}
                placeholder="e.g. 45"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all"
              />
            </div>
            {errors.minutes && (
              <p data-testid="error-minutes" className="text-xs text-rose-600 font-medium mt-1">
                {errors.minutes}
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Genre *
            </label>
            <select
              id="log-genre"
              data-testid="input-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value as Genre)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 transition-all cursor-pointer"
            >
              {ALLOWED_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.genre && (
              <p data-testid="error-genre" className="text-xs text-rose-600 font-medium mt-1">
                {errors.genre}
              </p>
            )}
          </div>
        </div>

        {/* Date and Favorite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Date Read *
            </label>
            <input
              id="log-date"
              data-testid="input-date"
              type="date"
              value={readAt}
              onChange={(e) => {
                setReadAt(e.target.value);
                if (errors.readAt) setErrors((prev) => ({ ...prev, readAt: undefined }));
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 transition-all cursor-pointer"
            />
            {errors.readAt && (
              <p data-testid="error-date" className="text-xs text-rose-600 font-medium mt-1">
                {errors.readAt}
              </p>
            )}
          </div>

          <div className="pt-5 sm:pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700">Mark as Favorite ⭐</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
            Key Insights / Notes (Optional)
          </label>
          <textarea
            id="log-notes"
            data-testid="input-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Chapters finished, memorable quotes, key takeaways..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          data-testid="btn-submit-log"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl theme-gradient-btn text-white text-sm font-bold shadow-[0_6px_25px_rgba(2,132,199,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Reading Session</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

