"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  note: string;
  starred: boolean;
  spentAt: string;
  createdAt: string;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  total: number;
}

export interface ExpenseSummary {
  count: number;
  starredCount: number;
  totalAmount: number;
  breakdown: CategoryBreakdown[];
}

export interface ExpenseFilters {
  category: string;
  starred: boolean;
  q: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  summary: ExpenseSummary | null;
  loading: boolean;
  filters: ExpenseFilters;
  setCategoryFilter: (category: string) => void;
  setStarredFilter: (starred: boolean) => void;
  setSearchQuery: (q: string) => void;
  clearFilters: () => void;
  fetchData: () => Promise<void>;
  addExpense: (data: {
    title: string;
    amount: number;
    category: string;
    note?: string;
    spentAt: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateExpense: (
    id: string,
    data: Partial<{
      title: string;
      amount: number;
      category: string;
      note: string;
      spentAt: string;
      starred: boolean;
    }>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteExpense: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleStar: (id: string, currentStarred: boolean) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: "All",
    starred: false,
    q: "",
  });

  const prevUserIdRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setSummary(null);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "All") {
        params.append("category", filters.category);
      }
      if (filters.starred) {
        params.append("starred", "true");
      }
      if (filters.q.trim()) {
        params.append("q", filters.q.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";

      const [resExpenses, resSummary] = await Promise.all([
        fetch(`/api/expenses${queryString}`, { cache: "no-store" }),
        fetch(`/api/expenses/summary${queryString}`, { cache: "no-store" }),
      ]);

      if (resExpenses.ok) {
        const data = await resExpenses.json();
        setExpenses(data);
      }

      if (resSummary.ok) {
        const sumData = await resSummary.json();
        setSummary(sumData);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  // Handle user change or logout
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setSummary(null);
      setFilters({ category: "All", starred: false, q: "" });
      prevUserIdRef.current = null;
    } else {
      if (prevUserIdRef.current !== user.id) {
        setExpenses([]);
        setSummary(null);
        setFilters({ category: "All", starred: false, q: "" });
        prevUserIdRef.current = user.id;
      }
    }
  }, [user]);

  // Fetch data whenever user or filters change
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, filters, fetchData]);

  const setCategoryFilter = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const setStarredFilter = (starred: boolean) => {
    setFilters((prev) => ({ ...prev, starred }));
  };

  const setSearchQuery = (q: string) => {
    setFilters((prev) => ({ ...prev, q }));
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      starred: false,
      q: "",
    });
  };

  const addExpense = async (data: {
    title: string;
    amount: number;
    category: string;
    note?: string;
    spentAt: string;
  }) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || "Failed to add expense" };
      }

      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error occurred" };
    }
  };

  const updateExpense = async (
    id: string,
    data: Partial<{
      title: string;
      amount: number;
      category: string;
      note: string;
      spentAt: string;
      starred: boolean;
    }>
  ) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: result.error || "Failed to update expense",
        };
      }

      await fetchData();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: result.error || "Failed to delete expense",
        };
      }
      await fetchData();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  const toggleStar = async (id: string, currentStarred: boolean) => {
    // Optimistic UI update
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !currentStarred } : e))
    );
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: !currentStarred }),
      });
      if (!res.ok) {
        // Rollback on error
        setExpenses((prev) =>
          prev.map((e) => (e.id === id ? { ...e, starred: currentStarred } : e))
        );
      } else {
        await fetchData();
      }
    } catch {
      // Rollback on network failure
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, starred: currentStarred } : e))
      );
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        loading,
        filters,
        setCategoryFilter,
        setStarredFilter,
        setSearchQuery,
        clearFilters,
        fetchData,
        addExpense,
        updateExpense,
        deleteExpense,
        toggleStar,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
