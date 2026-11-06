"use client";

import React, { useState, useEffect } from "react";
import { ReadingLog, ALLOWED_GENRES, Genre } from "@/lib/types";
import { useReadingLogs } from "@/contexts/ReadingLogContext";
import { X, Loader2, Save } from "lucide-react";

interface EditReadingLogModalProps {
  log: ReadingLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditReadingLogModal({ log, isOpen, onClose }: EditReadingLogModalProps) {
  const { updateLog } = useReadingLogs();

  const [bookTitle, setBookTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [genre, setGenre] = useState<Genre>("Fiction");
  const [readAt, setReadAt] = useState("");
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (log) {
      setBookTitle(log.bookTitle || log.title || "");
      setMinutes(String(log.minutes || ""));
      setGenre((log.genre as Genre) || "Fiction");
      const d = log.readAt ? new Date(log.readAt).toISOString().split("T")[0] : "";
      setReadAt(d);
      setNotes(log.notes || log.note || "");
      setIsFavorite(Boolean(log.isFavorite || log.favorite));
      setError(null);
    }
  }, [log]);

  if (!isOpen || !log) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) {
      setError("Book title is required");
      return;
    }
    const minsNum = Number(minutes);
    if (!minutes || isNaN(minsNum) || !Number.isInteger(minsNum) || minsNum <= 0) {
      setError("Minutes must be a positive integer");
      return;
    }
    if (!readAt) {
      setError("Date is required");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await updateLog(log.id, {
      bookTitle: bookTitle.trim(),
      minutes: minsNum,
      genre,
      readAt: new Date(readAt),
      notes: notes.trim(),
      isFavorite,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to update reading session");
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-100 relative">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900">Edit Reading Session</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Book Title *
            </label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Minutes *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Genre *
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 transition-all cursor-pointer"
              >
                {ALLOWED_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 items-center">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Date *
              </label>
              <input
                type="date"
                value={readAt}
                onChange={(e) => setReadAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 transition-all cursor-pointer"
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-700">Favorite ⭐</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium text-slate-800 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl theme-gradient-btn text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
