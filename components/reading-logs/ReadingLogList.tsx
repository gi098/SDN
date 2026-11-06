"use client";

import React, { useState } from "react";
import { useReadingLogs } from "@/contexts/ReadingLogContext";
import { ReadingLog } from "@/lib/types";
import { EditReadingLogModal } from "./EditReadingLogModal";
import {
  BookOpen,
  Clock,
  Calendar,
  Star,
  Edit2,
  Trash2,
  Bookmark,
  FileText,
  AlertCircle,
} from "lucide-react";

export function ReadingLogList() {
  const { logs, loading, toggleFavorite, deleteLog } = useReadingLogs();

  const [editingLog, setEditingLog] = useState<ReadingLog | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this reading session?")) {
      await deleteLog(id);
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="frost-glass rounded-3xl p-12 text-center border border-sky-100">
        <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading your reading sessions...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="frost-glass rounded-3xl p-12 text-center border border-sky-100 shadow-[0_8px_30px_rgba(2,132,199,0.06)]"
      >
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4 border border-sky-100 shadow-inner">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-extrabold text-slate-800 mb-1">
          No reading sessions found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Start logging your daily reading activity on the left or clear your active filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div data-testid="log-list" className="space-y-3.5">
        {logs.map((log) => {
          const formattedDate = log.readAt
            ? new Date(log.readAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "";

          return (
            <div
              key={log.id}
              data-testid="log-item"
              className="frost-glass rounded-2xl p-4 sm:p-5 border border-sky-100/90 shadow-[0_4px_20px_rgba(2,132,199,0.05)] hover:shadow-[0_8px_30px_rgba(2,132,199,0.12)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5">
                {/* Favorite Star Toggle */}
                <button
                  type="button"
                  data-testid="toggle-favorite"
                  onClick={() => toggleFavorite(log.id)}
                  title={log.isFavorite ? "Remove favorite" : "Mark as favorite"}
                  className="mt-0.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      log.isFavorite
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                        : "text-slate-300 hover:text-amber-400"
                    }`}
                  />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      data-testid="log-title"
                      className="text-sm sm:text-base font-black text-slate-900 tracking-tight"
                    >
                      {log.bookTitle || log.title}
                    </h4>
                    <span
                      data-testid="log-genre"
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200/60"
                    >
                      {log.genre || log.category}
                    </span>
                  </div>

                  {log.notes && (
                    <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">
                      {log.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 pt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span data-testid="log-date">{formattedDate}</span>
                  </div>
                </div>
              </div>

              {/* Right: Minutes & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-baseline gap-1 px-3 py-1.5 rounded-xl bg-sky-50/80 border border-sky-100 text-sky-800">
                  <Clock className="w-3.5 h-3.5 text-sky-600 self-center" />
                  <span
                    data-testid="log-minutes"
                    className="text-base font-black tracking-tight"
                  >
                    {log.minutes}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    mins
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    data-testid="btn-edit-log"
                    onClick={() => setEditingLog(log)}
                    className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all cursor-pointer"
                    title="Edit session"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    data-testid="btn-delete-log"
                    onClick={() => handleDelete(log.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EditReadingLogModal
        log={editingLog}
        isOpen={Boolean(editingLog)}
        onClose={() => setEditingLog(null)}
      />
    </>
  );
}
