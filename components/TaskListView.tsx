"use client";

import { Task } from "@/lib/types";
import { Calendar, Edit3, Trash2, Check } from "lucide-react";

interface TaskListViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
}

export default function TaskListView({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskListViewProps) {
  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return {
          label: "DONE",
          classes: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold",
        };
      case "IN_PROGRESS":
        return {
          label: "IN PROGRESS",
          classes: "bg-teal-500/10 text-teal-300 border border-teal-500/30 font-bold",
        };
      default:
        return {
          label: "TO DO",
          classes: "bg-slate-800 text-slate-400 border border-white/10 font-bold",
        };
    }
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return {
          label: "HIGH",
          classes: "bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold",
        };
      case "MEDIUM":
        return {
          label: "MEDIUM",
          classes: "bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold",
        };
      default:
        return {
          label: "LOW",
          classes: "bg-slate-800/80 text-slate-400 border border-white/5 font-bold",
        };
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const statusBadge = getStatusBadge(task.status);
        const priorityBadge = getPriorityBadge(task.priority);
        const isOverdue =
          task.dueDate &&
          task.status !== "DONE" &&
          new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
        const isDone = task.status === "DONE";

        return (
          <div
            key={task.id}
            className={`bg-[#0a1222]/90 backdrop-blur-xl rounded-2xl border p-4 sm:p-5 transition-all ${
              isDone ? "border-white/5 opacity-70" : "border-white/10 hover:border-emerald-500/40 hover:bg-[#0c1629]"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => onToggleStatus(task)}
                className={`w-6 h-6 rounded-lg border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "border-slate-700 hover:border-emerald-400 bg-slate-950/60"
                }`}
                title="Toggle status"
              >
                {isDone && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                {/* Top Row: Title, Status, Actions */}
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3
                      className={`text-base sm:text-lg font-bold tracking-tight ${
                        isDone ? "text-slate-500 line-through" : "text-slate-100"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 rounded-md ${statusBadge.classes}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => onEdit(task)}
                      className="hover:text-emerald-400 transition-colors p-1"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="hover:text-rose-400 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Middle Row: Priority */}
                <div className="mb-2">
                  <span
                    className={`text-[9px] uppercase px-2 py-0.5 rounded-md ${priorityBadge.classes}`}
                  >
                    {priorityBadge.label}
                  </span>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-xs text-slate-400 mb-3 font-normal leading-relaxed">{task.description}</p>
                )}

                {/* Footer */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div
                    className={`flex items-center gap-1.5 font-medium ${
                      isDone
                        ? "text-slate-500"
                        : isOverdue
                        ? "text-rose-400 font-bold"
                        : "text-slate-300"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {task.dueDate ? (
                      <span suppressHydrationWarning>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="italic text-slate-500">No deadline</span>
                    )}
                  </div>
                  <span suppressHydrationWarning className="font-mono text-slate-500 text-[11px]">
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
