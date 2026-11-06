export const ALLOWED_GENRES = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Other",
] as const;

export type Genre = (typeof ALLOWED_GENRES)[number];

export interface User {
  id: string;
  email: string;
}

export interface ReadingLog {
  id: string;
  userId: string;
  bookTitle: string;
  title?: string;
  minutes: number;
  genre: string;
  category?: string;
  notes: string;
  note?: string;
  isFavorite: boolean;
  favorite?: boolean;
  readAt: string | Date;
  date?: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface GenreBreakdown {
  genre: string;
  category?: string;
  count: number;
  totalMinutes: number;
  total?: number;
  percentage: number;
}

export interface ReadingSummary {
  totalSessions: number;
  totalLogs?: number;
  totalMinutes: number;
  favoriteCount: number;
  starredCount?: number;
  genreBreakdown: GenreBreakdown[];
  categoryBreakdown?: GenreBreakdown[];
}
