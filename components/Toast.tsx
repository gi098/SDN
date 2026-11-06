"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-emerald-400 shrink-0" />,
  };

  const borderStyles = {
    success: "border-emerald-500/30 bg-[#0a1222]/95 text-white shadow-2xl shadow-emerald-500/10",
    error: "border-rose-500/30 bg-[#0a1222]/95 text-white shadow-2xl shadow-rose-500/10",
    info: "border-emerald-500/30 bg-[#0a1222]/95 text-white shadow-2xl shadow-emerald-500/10",
  };

  const badgeStyles = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    error: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    info: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom-5 duration-300 ${
        borderStyles[toast.type]
      }`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-white">{toast.title}</p>
          <span
            className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full border ${
              badgeStyles[toast.type]
            }`}
          >
            {toast.type}
          </span>
        </div>
        {toast.description && (
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
