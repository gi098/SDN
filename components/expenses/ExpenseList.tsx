"use client";

import React, { useState } from "react";
import { Expense, useExpenses } from "@/contexts/ExpenseContext";
import { Star, Trash2, Edit2, Calendar, FileText, Layers } from "lucide-react";
import { EditExpenseModal } from "./EditExpenseModal";

export function ExpenseList() {
  const { expenses, toggleStar, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setDeletingId(id);
      try {
        await deleteExpense(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Food":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "Transport":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "Bills":
        return "bg-sky-50 border-sky-200 text-sky-700";
      case "Shopping":
        return "bg-indigo-50 border-indigo-200 text-indigo-700";
      default:
        return "bg-slate-100 border-slate-200 text-slate-700";
    }
  };

  return (
    <div className="space-y-3">
      {/* Container with data-testid="expense-list" */}
      <div data-testid="expense-list" className="space-y-3">
        {expenses.length === 0 ? (
          <div
            data-testid="expenses-empty"
            className="flex flex-col items-center justify-center p-12 cloud-glass rounded-3xl text-center shadow-xs"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-sky-500/10 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-xs">
              <Layers className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No expenses found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              No expenditure records match your active criteria. Try adjusting your
              filters or log a new transaction above.
            </p>
          </div>
        ) : (
          expenses.map((expense) => {
            const dateStr = new Date(expense.spentAt)
              .toISOString()
              .split("T")[0];

            return (
              <div
                key={expense.id}
                data-testid="expense-item"
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 cloud-card rounded-2xl border border-white/90 hover:border-amber-300/80 shadow-xs hover:shadow-md transition-all duration-300 gap-4"
              >
                {/* Left side: Star, Title, Category, Note, Date */}
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  {/* Star Toggle Button */}
                  <button
                    type="button"
                    data-testid="toggle-star"
                    aria-pressed={expense.starred ? "true" : "false"}
                    onClick={() => toggleStar(expense.id, expense.starred)}
                    className="mt-1 p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all cursor-pointer"
                    title={
                      expense.starred
                        ? "Remove from starred"
                        : "Mark as starred"
                    }
                  >
                    <Star
                      className={`w-5 h-5 transition-transform active:scale-125 ${
                        expense.starred
                          ? "fill-amber-400 text-amber-500 drop-shadow-xs"
                          : "text-slate-300 hover:text-amber-500"
                      }`}
                    />
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        data-testid="expense-title"
                        className="font-bold text-slate-900 text-base truncate group-hover:text-rose-600 transition-colors"
                      >
                        {expense.title}
                      </h4>
                      <span
                        data-testid="expense-category"
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        {expense.category}
                      </span>
                    </div>

                    {expense.note && (
                      <p className="text-xs text-slate-500 flex items-center space-x-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span>{expense.note}</span>
                      </p>
                    )}

                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span data-testid="expense-date">{dateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Amount, Edit, Delete */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span
                      data-testid="expense-amount"
                      className="text-lg font-black text-slate-900"
                    >
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => setEditingExpense(expense)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
                      title="Edit expense"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      data-testid="btn-delete-expense"
                      disabled={deletingId === expense.id}
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          isOpen={Boolean(editingExpense)}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}

export default ExpenseList;
