import { ALLOWED_GENRES, Genre } from "./types";

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

export function validateReadingLogInput(data: {
  bookTitle?: unknown;
  title?: unknown;
  minutes?: unknown;
  genre?: unknown;
  category?: unknown;
  notes?: unknown;
  note?: unknown;
  readAt?: unknown;
  date?: unknown;
}): {
  valid: boolean;
  error?: string;
  field?: "bookTitle" | "minutes" | "genre" | "readAt";
  parsed?: {
    bookTitle: string;
    minutes: number;
    genre: Genre;
    notes: string;
    readAt: Date;
  };
} {
  const rawTitle = data.bookTitle ?? data.title;
  const bookTitle = typeof rawTitle === "string" ? rawTitle.trim() : "";
  if (!bookTitle) {
    return {
      valid: false,
      error: "Book title is required",
      field: "bookTitle",
    };
  }

  const rawMinutes = data.minutes;
  let parsedMinutes: number | null = null;
  if (typeof rawMinutes === "number" && Number.isFinite(rawMinutes)) {
    parsedMinutes = rawMinutes;
  } else if (typeof rawMinutes === "string" && rawMinutes.trim() !== "") {
    const n = Number(rawMinutes);
    if (!isNaN(n) && Number.isFinite(n)) {
      parsedMinutes = n;
    }
  }

  if (parsedMinutes === null) {
    return {
      valid: false,
      error: "Reading minutes are required",
      field: "minutes",
    };
  }

  if (!Number.isInteger(parsedMinutes) || parsedMinutes <= 0) {
    return {
      valid: false,
      error: "Minutes must be a positive integer",
      field: "minutes",
    };
  }

  const rawGenre = data.genre ?? data.category;
  const genre = typeof rawGenre === "string" ? rawGenre.trim() : "";
  if (!genre) {
    return { valid: false, error: "Genre is required", field: "genre" };
  }
  if (!ALLOWED_GENRES.includes(genre as Genre)) {
    return {
      valid: false,
      error: `Genre must be one of: ${ALLOWED_GENRES.join(", ")}`,
      field: "genre",
    };
  }

  const rawDate = data.readAt ?? data.date;
  if (!rawDate) {
    return { valid: false, error: "Date is required", field: "readAt" };
  }
  const dateObj = new Date(rawDate as string | number | Date);
  if (isNaN(dateObj.getTime())) {
    return {
      valid: false,
      error: "Please enter a valid date",
      field: "readAt",
    };
  }

  const rawNotes = data.notes ?? data.note;
  const notes = typeof rawNotes === "string" ? rawNotes.trim() : "";

  return {
    valid: true,
    parsed: {
      bookTitle,
      minutes: parsedMinutes,
      genre: genre as Genre,
      notes,
      readAt: dateObj,
    },
  };
}
