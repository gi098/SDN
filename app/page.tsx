"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  X,
  Zap,
  TrendingUp,
  Layers,
} from "lucide-react";
import TaskCard from "@/components/TaskCard";
import TaskListView from "@/components/TaskListView";
import TaskModal from "@/components/TaskModal";
import Toast, { ToastMessage } from "@/components/Toast";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useLanguage } from "@/lib/languageContext";
import { Task, TaskFormData, TaskStatus, TaskPriority } from "@/lib/types";

export default function HomePage() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "dueDate" | "title" | "priority">("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete Confirm Modal State
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error(`Failed to load tasks (Status: ${res.status})`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the database. Make sure your DATABASE_URL is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initialLoad = async () => {
      try {
        setError(null);
        const res = await fetch("/api/tasks");
        if (!res.ok) {
          throw new Error(`Failed to load tasks (Status: ${res.status})`);
        }
        const data = await res.json();
        if (isMounted) setTasks(data);
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not connect to the database. Make sure your DATABASE_URL is configured."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initialLoad();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Create or Update
  const handleFormSubmit = async (formData: TaskFormData) => {
    if (editingTask) {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error || "Failed to update task";
        addToast("error", t("toastErrorUpdate"), msg);
        throw new Error(msg);
      }

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      addToast("success", t("toastUpdatedTitle"), `${t("toastUpdatedDesc")} "${updated.title}".`);
    } else {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error || "Failed to create task";
        addToast("error", t("toastErrorCreate"), msg);
        throw new Error(msg);
      }

      const created = await res.json();
      setTasks((prev) => [created, ...prev]);

      if (statusFilter !== "ALL" && statusFilter !== created.status) {
        setStatusFilter("ALL");
      }
      if (priorityFilter !== "ALL" && priorityFilter !== created.priority) {
        setPriorityFilter("ALL");
      }
      if (searchQuery.trim() !== "") {
        setSearchQuery("");
      }

      addToast("success", t("toastCreatedTitle"), `"${created.title}" ${t("toastCreatedDesc")}`);
    }
  };

  // Open Delete Confirmation Modal
  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (taskToDelete) {
      setDeletingTask(taskToDelete);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/tasks/${deletingTask.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete task");
      }

      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      addToast("success", t("toastDeletedTitle"), `"${deletingTask.title}" ${t("toastDeletedDesc")}`);
      setDeletingTask(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete task";
      addToast("error", t("toastErrorDelete"), msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (task: Task) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      TODO: "IN_PROGRESS",
      IN_PROGRESS: "DONE",
      DONE: "TODO",
    };
    const newStatus = nextStatus[task.status];

    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    addToast("info", t("toastStatusTitle"), `"${task.title}" ➔ ${newStatus}`);

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        fetchTasks();
        addToast("error", t("toastErrorSync"), "Failed to update status in the database");
      }
    } catch {
      fetchTasks();
      addToast("error", t("toastErrorNetwork"), t("toastErrorNetworkDesc"));
    }
  };

  // Open Edit Modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const done = tasks.filter((t) => t.status === "DONE").length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, todo, inProgress, done, completionRate };
  }, [tasks]);

  // Filtered & Sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesStatus = statusFilter === "ALL" ? true : t.status === statusFilter;
        const matchesPriority = priorityFilter === "ALL" ? true : t.priority === priorityFilter;
        const matchesSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesPriority && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "priority") {
          const pOrder: Record<TaskPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        if (sortBy === "dueDate") {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, searchQuery, sortBy]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 md:py-12 space-y-8 animate-in fade-in duration-500">
      
      {/* Modern High-Tech Hero Command Center (Xanh Đen + Xanh Lá) */}
      <section className="relative overflow-hidden rounded-3xl bg-[#091120] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] p-8 md:p-12 text-white">
        {/* Glowing Ambient Emerald & Navy Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/25 via-teal-600/20 to-transparent blur-[90px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-green-600/20 to-emerald-500/10 blur-[80px] rounded-full translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col items-start gap-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black tracking-widest uppercase">{t("liveWorkspace")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300">Command Center</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
              Real-time task orchestration connected directly to your cloud PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchTasks}
              className="p-3 rounded-xl bg-[#0e182c] hover:bg-[#13223e] border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 rounded-xl theme-gradient-btn hover:scale-105 active:scale-95 text-white font-bold transition-all flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(16,185,129,0.45)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t("btnNewTask")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Split Layout: Sidebar + Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT SIDEBAR: Insights & KPIs */}
        <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-24">
          
          {/* Sprint Progress Widget */}
          <div className="p-5 rounded-2xl bg-[#091120] border border-white/10 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Completion Velocity</span>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                {stats.completionRate}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#050a12] rounded-full overflow-hidden mb-3 border border-white/5 p-[1px]">
              <div 
                className="h-full sprint-progress-bar rounded-full transition-all duration-700"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {stats.done} Done</span>
              <span className="flex items-center gap-1"><ListTodo className="w-3.5 h-3.5 text-teal-400" /> {stats.total} Total</span>
            </div>
          </div>

          {/* Vertical KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Card 1: Total */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#091120] shadow-md hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.18)] transition-all flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white leading-none mb-1">{stats.total}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("statTotal")}</div>
              </div>
            </div>

            {/* Card 2: To Do */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#091120] shadow-md hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.18)] transition-all flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white leading-none mb-1">{stats.todo}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("statTodo")}</div>
              </div>
            </div>

            {/* Card 3: In Progress */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#091120] shadow-md hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.18)] transition-all flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white leading-none mb-1">{stats.inProgress}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("statInProgress")}</div>
              </div>
            </div>

            {/* Card 4: Done */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#091120] shadow-md hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.22)] transition-all flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white leading-none mb-1">{stats.done}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("statDone")}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT: Toolbar & Tasks */}
        <main className="flex-1 w-full min-w-0 flex flex-col gap-4">
          
          {/* Clean Dark Toolbar */}
          <div className="bg-[#091120] backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-xl">
            {/* Top Row: Search & Priority & Sort */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 border-b border-white/5 pb-4 mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl border border-white/10 bg-[#060b14] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters & View Mode */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Priority Selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span className="hidden sm:inline">Priority:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl border border-white/10 bg-[#060b14] text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="ALL">{t("filterPriorityAll")}</option>
                    <option value="HIGH">{t("priorityHigh")}</option>
                    <option value="MEDIUM">{t("priorityMedium")}</option>
                    <option value="LOW">{t("priorityLow")}</option>
                  </select>
                </div>
                
                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="py-2 px-3 rounded-xl border border-white/10 bg-[#060b14] text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="newest">{t("sortByNewest")}</option>
                    <option value="oldest">{t("sortByOldest")}</option>
                    <option value="dueDate">{t("sortByDueDate")}</option>
                    <option value="priority">{t("sortByPriority")}</option>
                    <option value="title">{t("sortByTitle")}</option>
                  </select>
                </div>
                
                {/* View Mode Toggle (Grid/List) */}
                <div className="flex items-center p-1 rounded-xl border border-white/10 bg-[#060b14] ml-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === "grid" ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/35" : "text-slate-400 hover:text-white"}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === "list" ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/35" : "text-slate-400 hover:text-white"}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Tabs & Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: "ALL", label: t("filterStatusAll"), count: stats.total },
                  { id: "TODO", label: t("statTodo"), count: stats.todo },
                  { id: "IN_PROGRESS", label: t("statInProgress"), count: stats.inProgress },
                  { id: "DONE", label: t("statDone"), count: stats.done },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      statusFilter === tab.id
                        ? "theme-active-tab text-white shadow-lg"
                        : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      statusFilter === tab.id ? "bg-white/20 text-white" : "bg-[#060b14] text-slate-400"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Showing {filteredTasks.length} / {stats.total} tasks
              </div>
            </div>
          </div>

          {/* Database Error Banner if any */}
          {error && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-300 text-sm shadow-md">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold flex items-center gap-2">
                  Database Notice
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-semibold">
                    Setup Required
                  </span>
                </p>
                <p className="text-xs text-amber-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Tasks Render (Grid or List) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="h-36 rounded-2xl bg-[#091120] animate-pulse border border-white/5"
                />
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            ) : (
              <TaskListView
                tasks={filteredTasks}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
              />
            )
          ) : (
            /* Modern High-Tech Empty State */
            <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/10 bg-[#091120]/40 backdrop-blur-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-cyber-pulse">
                <Layers className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL"
                  ? t("noTasksFound")
                  : "No Tasks In Orbit"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
                {searchQuery ? "Try a different search query or reset your filters." : "Initialize your first project task to begin tracking progress."}
              </p>
              {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setPriorityFilter("ALL");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-white/10"
                >
                  {t("clearFilters")}
                </button>
              ) : (
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl theme-gradient-btn hover:scale-105 active:scale-95 text-white text-xs font-bold shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t("btnNewTask")}</span>
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        key={editingTask ? editingTask.id : isModalOpen ? "create-open" : "create-closed"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        task={deletingTask}
        isDeleting={isDeleting}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Floating Animated Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
