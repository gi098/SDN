"use client";

import { useState } from "react";
import { X, Calendar, AlertCircle, Loader2, Sparkles, CheckSquare } from "lucide-react";
import { Task, TaskFormData, TaskPriority, TaskStatus } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialTask?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialTask }: TaskModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<TaskFormData>(() => ({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    status: initialTask?.status || "TODO",
    priority: initialTask?.priority || "MEDIUM",
    dueDate: initialTask?.dueDate ? initialTask.dueDate.substring(0, 10) : "",
  }));

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (formData.title.length > 100) {
      setError("Title cannot exceed 100 characters.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#0c1222] rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 bg-slate-950/90 border-b border-white/10 overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-transparent blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-wider mb-1 border border-cyan-500/20">
                  <Sparkles className="w-3 h-3" />
                  NEXUS TASK
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {initialTask ? t("modalEditTitle") : t("modalCreateTitle")}
                </h3>
              </div>
            </div>
            
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3.5 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl backdrop-blur-sm shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                {t("labelTitle")} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder={t("placeholderTitle")}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                {t("labelDescription")}
              </label>
              <textarea
                rows={3}
                placeholder={t("placeholderDesc")}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Grid for Status, Priority, Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  {t("labelStatus")}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:outline-none focus:border-cyan-400 transition-all text-sm font-bold text-slate-200 cursor-pointer"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  {t("labelPriority")}
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as TaskPriority })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:outline-none focus:border-cyan-400 transition-all text-sm font-bold text-slate-200 cursor-pointer"
                >
                  <option value="LOW">{t("priorityLow")}</option>
                  <option value="MEDIUM">{t("priorityMedium")}</option>
                  <option value="HIGH">{t("priorityHigh")}</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  {t("labelDueDate")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/70 focus:outline-none focus:border-cyan-400 text-sm font-medium text-slate-200"
                  />
                  <Calendar className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {t("btnCancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold text-white theme-gradient-btn hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{initialTask ? t("btnSaving") : t("btnCreating")}</span>
                  </>
                ) : (
                  <span>{initialTask ? t("btnSaveChanges") : t("btnCreateTask")}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
