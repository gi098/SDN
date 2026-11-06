"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { Task } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({
  isOpen,
  task,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const { t } = useLanguage();

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0c1222] rounded-3xl shadow-2xl border border-rose-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t("deleteTitle")}</span>
              </h3>
              <p className="text-xs text-rose-400">{t("deleteWarning")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            type="button"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-300 leading-relaxed">
              {t("deleteDesc")}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 mb-6">
            <p className="text-xs text-slate-400 font-semibold mb-1">{t("deleteTaskLabel")}</p>
            <p className="text-sm font-bold text-slate-100 line-clamp-2">{task.title}</p>
            {task.description && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              type="button"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              {t("btnCancel")}
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 active:scale-95 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? t("btnDeleting") : t("btnDeleteNow")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
