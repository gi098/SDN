"use client";

import { Task } from "@/lib/types";
import { Calendar, Edit3, Trash2, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  // Status style helper
  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return {
          label: "Done",
          dotColor: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
          accentLine: "card-accent-done",
          cardBorder: "hover:border-emerald-500/50 hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.25)]",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          classes:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          dotColor: "bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse",
          accentLine: "card-accent-in-progress",
          cardBorder: "hover:border-cyan-500/50 hover:shadow-[0_8px_30px_-5px_rgba(6,182,212,0.25)]",
          icon: <Clock className="w-3.5 h-3.5 text-cyan-400" />,
          classes:
            "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20",
        };
      default:
        return {
          label: "To Do",
          dotColor: "bg-slate-400",
          accentLine: "card-accent-todo",
          cardBorder: "hover:border-violet-500/50 hover:shadow-[0_8px_30px_-5px_rgba(139,92,246,0.25)]",
          icon: <Circle className="w-3.5 h-3.5 text-slate-400" />,
          classes:
            "bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-800",
        };
    }
  };

  // Priority style helper
  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return {
          label: "High Priority",
          classes:
            "bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold",
        };
      case "MEDIUM":
        return {
          label: "Medium",
          classes:
            "bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold",
        };
      default:
        return {
          label: "Low",
          classes:
            "bg-slate-800/60 text-slate-400 border-white/5 font-medium",
        };
    }
  };

  // Due date status
  const isOverdue =
    task.dueDate && task.status !== "DONE" && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const statusBadge = getStatusBadge(task.status);
  const priorityBadge = getPriorityBadge(task.priority);

  return (
    <div
      className={`group relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${statusBadge.cardBorder}`}
    >
      {/* Top Colorful Accent Line */}
      <div className={`h-1 w-full ${statusBadge.accentLine}`} />

      <div className="p-4 sm:p-5">
        {/* Top badges & actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onToggleStatus(task)}
              title="Click to advance status"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all active:scale-95 ${statusBadge.classes}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
              <span>{statusBadge.label}</span>
            </button>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] border ${priorityBadge.classes}`}
            >
              {priorityBadge.label}
            </span>

            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/40 animate-pulse shadow-sm">
                <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                Overdue
              </span>
            )}
          </div>

          {/* Edit / Delete actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4
          className={`font-bold text-sm sm:text-base leading-snug mb-2 transition-colors line-clamp-2 ${
            task.status === "DONE"
              ? "line-through text-slate-500"
              : "text-slate-100 group-hover:text-cyan-300"
          }`}
        >
          {task.title}
        </h4>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 font-normal">
            {task.description}
          </p>
        )}
      </div>

      {/* Due date & footer info */}
      <div className="px-4 py-2.5 border-t border-white/5 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 mt-auto">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          {task.dueDate ? (
            <span
              suppressHydrationWarning
              className={`font-medium ${
                isOverdue ? "text-rose-400 font-bold" : "text-slate-300"
              }`}
            >
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          ) : (
            <span className="text-slate-500 italic">No deadline</span>
          )}
        </div>
        <span suppressHydrationWarning className="text-[10px] text-slate-500 font-mono">
          {new Date(task.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
