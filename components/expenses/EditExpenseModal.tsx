"use client";

import React, { useState } from "react";
import { Expense, useExpenses } from "@/contexts/ExpenseContext";
import { ALLOWED_CATEGORIES } from "@/lib/validations";
import { X, AlertCircle } from "lucide-react";

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
}

export function EditExpenseModal({
  expense,
  isOpen,
  onClose,
}: EditExpenseModalProps) {
  const { updateExpense } = useExpenses();

  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [note, setNote] = useState(expense.note || "");
  const [spentAt, setSpentAt] = useState(() => {
    return new Date(expense.spentAt).toISOString().split("T")[0];
  });

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    category?: string;
    date?: string;
    expense?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: {
      title?: string;
      amount?: string;
      category?: string;
      date?: string;
    } = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errs.title = "Title is required";
    } else if (trimmedTitle.length > 80) {
      errs.title = "Title must be at most 80 characters";
    }

    if (amount === "" || amount === null || amount === undefined) {
      errs.amount = "Amount is required";
    } else {
      const num = Number(amount);
      if (isNaN(num) || num <= 0) {
        errs.amount = "Amount must be a positive number";
      }
    }

    if (!category || category.trim() === "") {
      errs.category = "Please choose a category";
    } else if (!ALLOWED_CATEGORIES.includes(category as any)) {
      errs.category = "Invalid category";
    }

    if (!spentAt || spentAt.trim() === "") {
      errs.date = "Date is required";
    } else {
      const dateObj = new Date(spentAt);
      if (isNaN(dateObj.getTime())) {
        errs.date = "Date is required";
      } else {
        const now = new Date();
        const endOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );
        if (dateObj.getTime() > endOfToday.getTime()) {
          errs.date = "Date cannot be in the future";
        }
      }
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrs = validate();
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await updateExpense(expense.id, {
        title: title.trim(),
        amount: Number(amount),
        category,
        note: note.trim(),
        spentAt,
      });

      if (!res.success) {
        setErrors({ expense: res.error || "Failed to update expense" });
      } else {
        onClose();
      }
    } catch {
      setErrors({ expense: "Network error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.15),0_0_25px_rgba(225,29,72,0.08)] border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Edit Expense Record
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4">
          {errors.expense && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errors.expense}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                errors.title
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-600 font-medium ml-1 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                  errors.amount
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
                }`}
              />
              {errors.amount && (
                <p className="text-[11px] text-rose-600 font-medium ml-1 mt-1">
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 transition-all cursor-pointer ${
                  errors.category
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
                }`}
              >
                {ALLOWED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-rose-600 font-medium ml-1 mt-1">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">
              Date
            </label>
            <input
              type="date"
              value={spentAt}
              onChange={(e) => setSpentAt(e.target.value)}
              disabled={loading}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                errors.date
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
              }`}
            />
            {errors.date && (
              <p className="text-[11px] text-rose-600 font-medium ml-1 mt-1">
                {errors.date}
              </p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl theme-gradient-btn text-white text-xs font-bold shadow-[0_4px_16px_rgba(225,29,72,0.35)] cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
