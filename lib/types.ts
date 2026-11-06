import { ALLOWED_CATEGORIES, Category } from "./validations";

export { ALLOWED_CATEGORIES };
export type { Category };

export interface User {
  id: string;
  email: string;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  note: string;
  starred: boolean;
  spentAt: string | Date;
  createdAt: string | Date;
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
