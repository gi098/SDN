"use client";

import { useEffect, useState } from "react";
import { PlusCircle, CheckCircle2, Pencil, Trash2, UserPlus, ShieldAlert, Settings, Sparkles } from "lucide-react";
import { useRealtimeSubscription } from "@/lib/realtimeClient";
import { useLanguage } from "@/lib/languageContext";

interface TeamActivityLogProps {
  teamId: string;
}

export default function TeamActivityLog({ teamId }: TeamActivityLogProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const { t } = useLanguage();

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/activity`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchLogs();
  }, [teamId]);

  useRealtimeSubscription({
    channel: `team-${teamId}`,
    onEvent: (event, data) => {
      if (event === "activity:new" && data) {
        setLogs((prev) => [data, ...prev]);
      }
    },
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "TASK_CREATED":
        return <PlusCircle className="w-4 h-4 text-emerald-400" />;
      case "TASK_STATUS_CHANGED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "TASK_UPDATED":
        return <Pencil className="w-4 h-4 text-teal-400" />;
      case "TASK_DELETED":
        return <Trash2 className="w-4 h-4 text-rose-400" />;
      case "MEMBER_ADDED":
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case "ROLE_UPDATED":
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      default:
        return <Settings className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "ALL") return true;
    if (filter === "TASKS") return log.action.startsWith("TASK_");
    if (filter === "MEMBERS") return log.action.includes("MEMBER") || log.action.includes("ROLE");
    return true;
  });

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            {t("auditTrail")}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("auditLogSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "TASKS", "MEMBERS"].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === opt
                  ? "theme-gradient-btn text-white shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
              }`}
            >
              {opt === "ALL" ? t("filterAll") : opt === "TASKS" ? t("filterTasks") : t("filterMembers")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading activity stream...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            {t("noActivityYet")}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-white/10"
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 font-medium leading-relaxed">{log.details}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
