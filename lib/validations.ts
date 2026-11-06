export const ALLOWED_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Other",
] as const;

export type Category = (typeof ALLOWED_CATEGORIES)[number];

export function validateRegisterInput(data: {
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
  name?: unknown;
}): {
  valid: boolean;
  error?: string;
  field?: "email" | "password" | "confirmPassword";
} {
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";
  const confirmPassword =
    typeof data.confirmPassword === "string" ? data.confirmPassword : "";

  if (!email) {
    return { valid: false, error: "Email is required", field: "email" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address",
      field: "email",
    };
  }
  if (!password) {
    return { valid: false, error: "Password is required", field: "password" };
  }
  if (password.length < 6) {
    return {
      valid: false,
      error: "Password must be at least 6 characters",
      field: "password",
    };
  }
  if (!confirmPassword) {
    return {
      valid: false,
      error: "Confirm password is required",
      field: "confirmPassword",
    };
  }
  if (password !== confirmPassword) {
    return {
      valid: false,
      error: "Passwords do not match",
      field: "confirmPassword",
    };
  }

  return { valid: true };
}

export function validateLoginInput(data: {
  email?: unknown;
  password?: unknown;
}): { valid: boolean; error?: string; field?: "email" | "password" } {
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!email) {
    return { valid: false, error: "Email is required", field: "email" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address",
      field: "email",
    };
  }
  if (!password) {
    return { valid: false, error: "Password is required", field: "password" };
  }

  return { valid: true };
}

export function validateExpenseInput(data: {
  title?: unknown;
  amount?: unknown;
  category?: unknown;
  note?: unknown;
  spentAt?: unknown;
}): {
  valid: boolean;
  error?: string;
  field?: "title" | "amount" | "category" | "date";
  parsed?: {
    title: string;
    amount: number;
    category: string;
    note: string;
    spentAt: Date;
  };
} {
  // Title
  if (
    data.title === undefined ||
    data.title === null ||
    String(data.title).trim() === ""
  ) {
    return { valid: false, error: "Title is required", field: "title" };
  }
  const title = String(data.title).trim();
  if (title.length > 80) {
    return {
      valid: false,
      error: "Title must be at most 80 characters",
      field: "title",
    };
  }

  // Amount
  if (
    data.amount === undefined ||
    data.amount === null ||
    String(data.amount).trim() === ""
  ) {
    return { valid: false, error: "Amount is required", field: "amount" };
  }
  const numAmount = Number(data.amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      valid: false,
      error: "Amount must be a positive number",
      field: "amount",
    };
  }

  // Category
  if (!data.category || String(data.category).trim() === "") {
    return {
      valid: false,
      error: "Please choose a category",
      field: "category",
    };
  }
  const category = String(data.category).trim();
  if (!ALLOWED_CATEGORIES.includes(category as Category)) {
    return { valid: false, error: "Invalid category", field: "category" };
  }

  // Date (spentAt)
  if (!data.spentAt || String(data.spentAt).trim() === "") {
    return { valid: false, error: "Date is required", field: "date" };
  }
  const spentAtDate = new Date(String(data.spentAt));
  if (isNaN(spentAtDate.getTime())) {
    return { valid: false, error: "Date is required", field: "date" };
  }

  // Date cannot be in the future
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
  if (spentAtDate.getTime() > endOfToday.getTime()) {
    return {
      valid: false,
      error: "Date cannot be in the future",
      field: "date",
    };
  }

  const note =
    data.note !== undefined && data.note !== null
      ? String(data.note).trim()
      : "";

  return {
    valid: true,
    parsed: {
      title,
      amount: Math.round(numAmount * 100) / 100,
      category,
      note,
      spentAt: spentAtDate,
    },
  };
}
