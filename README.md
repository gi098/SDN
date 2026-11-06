# ReadLog – Personal Reading Tracker

ReadLog is a modern, high-performance personal reading log and habit-tracking web application built according to the **SDN302 Practical Exam** specification.

## 🚀 Key Features

- **Authentication & Security**:
  - Secure registration & login with email/password.
  - Password hashing via `bcryptjs`.
  - Session management using custom JWT and strict `HttpOnly` cookie named `session_token`.
  - Server-side and client-side validation.
  - Strict data isolation ensuring each user only accesses their own reading logs.
- **Reading Log Management**:
  - Add reading sessions with book title, reading minutes, genre, date, and key insights/notes.
  - Instant duplicate session detection (same book title, minutes, and date for the same user).
  - Favorite / bookmark reading sessions with real-time toggle.
  - Edit and delete reading sessions with immediate synchronization.
  - Responsive reading session cards and intuitive interactions.
- **Dynamic Filtering & Search**:
  - Filter by genre (`Fiction`, `Non-Fiction`, `Science`, `History`, `Other`).
  - Filter by favorite reading sessions only.
  - Real-time search across book titles and notes.
  - One-click clear all filters.
- **Real-Time Analytics & Dashboard**:
  - Total reading sessions, total minutes read, and favorite sessions count.
  - Genre distribution breakdown with percentages, session counts, and total minutes.
  - Live progress bars indicating reading time share per genre.
- **Modern Responsive Design**:
  - Arctic Frost & Winter Ocean Blue aesthetic with interactive 3D Arctic Fox.
  - Built with Tailwind CSS and ShadCN UI.
  - Responsive across mobile (375px without horizontal scrolling) and desktop (1280px).

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma ORM
- **UI Components**: ShadCN UI + Tailwind CSS + Lucide Icons
- **State Management**: React Context (`AuthProvider` & `ReadingLogProvider`)
- **Deployment**: Vercel

## ⚙️ Environment Configuration

Configure your environment in `.env`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
AUTH_SECRET="your-secure-jwt-auth-secret-key"
```
