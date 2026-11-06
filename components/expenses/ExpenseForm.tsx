"use client";

import React, { useState } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { ALLOWED_CATEGORIES } from "@/lib/validations";

export function ExpenseForm() {
  const { addExpense } = useExpenses();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [spentAt, setSpentAt] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    category?: string;
    date?: string;
    expense?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (
    tVal = title,
    aVal = amount,
    cVal = category,
    dVal = spentAt
  ) => {
    const errs: {
      title?: string;
      amount?: string;
      category?: string;
      date?: string;
    } = {};

    const trimmedTitle = tVal.trim();
    if (!trimmedTitle) {
      errs.title = "Title is required";
    } else if (trimmedTitle.length > 80) {
      errs.title = "Title must be at most 80 characters";
    }

    if (aVal === "" || aVal === null || aVal === undefined) {
      errs.amount = "Amount is required";
    } else {
      const num = Number(aVal);
      if (isNaN(num) || num <= 0) {
        errs.amount = "Amount must be a positive number";
      }
    }

    if (!cVal || cVal.trim() === "") {
      errs.category = "Please choose a category";
    } else if (!ALLOWED_CATEGORIES.includes(cVal as any)) {
      errs.category = "Invalid category";
    }

    if (!dVal || dVal.trim() === "") {
      errs.date = "Date is required";
    } else {
      const dateObj = new Date(dVal);
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (hasSubmitted) {
      const v = validate(val, amount, category, spentAt);
      setErrors((prev) => ({ ...prev, title: v.title, expense: undefined }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    if (hasSubmitted) {
      const v = validate(title, val, category, spentAt);
      setErrors((prev) => ({ ...prev, amount: v.amount, expense: undefined }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    if (hasSubmitted) {
      const v = validate(title, amount, val, spentAt);
      setErrors((prev) => ({ ...prev, category: v.category, expense: undefined }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpentAt(val);
    if (hasSubmitted) {
      const v = validate(title, amount, category, val);
      setErrors((prev) => ({ ...prev, date: v.date, expense: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setSuccessMessage("");

    const clientErrs = validate();
    if (Object.keys(clientErrs).length > 0) {
      setErrors(clientErrs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await addExpense({
        title: title.trim(),
        amount: Number(amount),
        category,
        note: note.trim(),
        spentAt,
      });

      if (!res.success) {
        setErrors({ expense: res.error || "Failed to add expense" });
      } else {
        setSuccessMessage("Expense added");
        setTitle("");
        setAmount("");
        setCategory("");
        setNote("");
        setSpentAt(new Date().toISOString().split("T")[0]);
        setHasSubmitted(false);
      }
    } catch {
      setErrors({ expense: "Network error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="frost-glass rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-sky-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(2,132,199,0.3)]">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Log New Expense
          </h3>
          <p className="text-xs text-slate-500">
            Record details with category, amount, and date
          </p>
        </div>
      </div>

      <form
        data-testid="expense-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {/* Server Error / Duplicate Error with data-testid="error-expense" */}
        {errors.expense && (
          <div
            data-testid="error-expense"
            className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errors.expense}</span>
          </div>
        )}

        {/* Success Message with data-testid="expense-success" */}
        {successMessage && (
          <div
            data-testid="expense-success"
            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1">
          <label
            htmlFor="input-title"
            className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1"
          >
            Title <span className="text-rose-600">*</span>
          </label>
          <input
            id="input-title"
            data-testid="input-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Grocery market haul, Metro transit ticket"
            disabled={loading}
            className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
              errors.title
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
            }`}
          />
          {errors.title && (
            <p
              data-testid="error-title"
              className="text-[11px] text-rose-600 font-medium ml-1 mt-1"
            >
              {errors.title}
            </p>
          )}
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Amount */}
          <div className="space-y-1">
            <label
              htmlFor="input-amount"
              className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1"
            >
              Amount ($) <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-amount"
              data-testid="input-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              disabled={loading}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
                errors.amount
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
              }`}
            />
            {errors.amount && (
              <p
                data-testid="error-amount"
                className="text-[11px] text-rose-600 font-medium ml-1 mt-1"
              >
                {errors.amount}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label
              htmlFor="input-category"
              className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1"
            >
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              id="input-category"
              data-testid="input-category"
              value={category}
              onChange={handleCategoryChange}
              disabled={loading}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 transition-all cursor-pointer ${
                errors.category
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
              }`}
            >
              <option value="" className="bg-white text-slate-400">Select category...</option>
              {ALLOWED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900">
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p
                data-testid="error-category"
                className="text-[11px] text-rose-600 font-medium ml-1 mt-1"
              >
                {errors.category}
              </p>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <label
            htmlFor="input-date"
            className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1"
          >
            Date <span className="text-rose-600">*</span>
          </label>
          <input
            id="input-date"
            data-testid="input-date"
            type="date"
            value={spentAt}
            onChange={handleDateChange}
            disabled={loading}
            className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
              errors.date
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 focus:border-rose-500 focus:ring-rose-500/20"
            }`}
          />
          {errors.date && (
            <p
              data-testid="error-date"
              className="text-[11px] text-rose-600 font-medium ml-1 mt-1"
            >
              {errors.date}
            </p>
          )}
        </div>

        {/* Note (optional) */}
        <div className="space-y-1">
          <label
            htmlFor="input-note"
            className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1"
          >
            Note <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            id="input-note"
            data-testid="input-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add receipt notes or memo"
            disabled={loading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Submit Button with data-testid="btn-add-expense" */}
        <button
          type="submit"
          data-testid="btn-add-expense"
          disabled={loading}
          className="w-full py-2.5 mt-2 rounded-xl theme-gradient-btn text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(225,29,72,0.35)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? "Adding Expense..." : "Add Expense"}</span>
        </button>
      </form>
    </div>
  );
}
