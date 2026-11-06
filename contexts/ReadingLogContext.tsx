"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ReadingLog, ReadingSummary } from "@/lib/types";
import { useAuth } from "./AuthContext";

interface ReadingLogContextType {
  logs: ReadingLog[];
  summary: ReadingSummary | null;
  loading: boolean;
  filters: {
    genre: string;
    isFavorite: boolean;
    search: string;
  };
  setGenre: (genre: string) => void;
  setIsFavorite: (isFavorite: boolean) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
  addLog: (data: Partial<ReadingLog>) => Promise<{ success: boolean; error?: string }>;
  updateLog: (id: string, data: Partial<ReadingLog>) => Promise<{ success: boolean; error?: string }>;
  deleteLog: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleFavorite: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshLogs: () => Promise<void>;
}

const ReadingLogContext = createContext<ReadingLogContextType | undefined>(
  undefined
);

export function ReadingLogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [summary, setSummary] = useState<ReadingSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    genre: "all",
    isFavorite: false,
    search: "",
  });

  const fetchLogsAndSummary = useCallback(async () => {
    if (!user) {
      setLogs([]);
      setSummary(null);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.genre && filters.genre !== "all") {
        params.set("genre", filters.genre);
      }
      if (filters.isFavorite) {
        params.set("isFavorite", "true");
      }
      if (filters.search.trim()) {
        params.set("search", filters.search.trim());
      }

      const queryString = params.toString();
      const logsUrl = `/api/reading-logs${queryString ? `?${queryString}` : ""}`;
      const summaryUrl = `/api/reading-logs/summary${queryString ? `?${queryString}` : ""}`;

      const [logsRes, summaryRes] = await Promise.all([
        fetch(logsUrl),
        fetch(summaryUrl),
      ]);

      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(Array.isArray(data) ? data : []);
      }

      if (summaryRes.ok) {
        const sumData = await summaryRes.json();
        setSummary(sumData);
      }
    } catch (err) {
      console.error("Failed to load reading logs:", err);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchLogsAndSummary();
  }, [fetchLogsAndSummary]);

  const setGenre = (genre: string) => {
    setFilters((prev) => ({ ...prev, genre }));
  };

  const setIsFavorite = (isFavorite: boolean) => {
    setFilters((prev) => ({ ...prev, isFavorite }));
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters({ genre: "all", isFavorite: false, search: "" });
  };

  const addLog = async (data: Partial<ReadingLog>) => {
    try {
      const res = await fetch("/api/reading-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Failed to add session" };
      }
      await fetchLogsAndSummary();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  const updateLog = async (id: string, data: Partial<ReadingLog>) => {
    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Failed to update session" };
      }
      await fetchLogsAndSummary();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Failed to delete session" };
      }
      await fetchLogsAndSummary();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const target = logs.find((l) => l.id === id);
      const nextFav = target ? !target.isFavorite : true;

      const res = await fetch(`/api/reading-logs/${id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: nextFav }),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Failed to update favorite" };
      }
      await fetchLogsAndSummary();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  return (
    <ReadingLogContext.Provider
      value={{
        logs,
        summary,
        loading,
        filters,
        setGenre,
        setIsFavorite,
        setSearch,
        clearFilters,
        addLog,
        updateLog,
        deleteLog,
        toggleFavorite,
        refreshLogs: fetchLogsAndSummary,
      }}
    >
      {children}
    </ReadingLogContext.Provider>
  );
}

export function useReadingLogs() {
  const ctx = useContext(ReadingLogContext);
  if (!ctx) {
    throw new Error("useReadingLogs must be used within a ReadingLogProvider");
  }
  return ctx;
}

