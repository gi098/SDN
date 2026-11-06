# ExpenseTrail – Personal Expense Tracker

ExpenseTrail is a modern, high-performance personal expense tracking web application built according to the **SDN302 Practical Exam** specification.

## 🚀 Key Features

- **Authentication & Security**:
  - Secure registration & login with email/password.
  - Password hashing via `bcryptjs`.
  - Session management using custom JWT and strict `HttpOnly` cookie named `session_token`.
  - Server-side and client-side validation.
  - Strict data isolation ensuring each user only accesses their own expenses.
- **Expense Management**:
  - Add expenses with title, amount, category, date, and optional note.
  - Instant duplicate transaction detection (same title, amount, date for the same user).
  - Star / unstar favorite transactions with real-time toggle.
  - Edit and delete expenses with immediate synchronization.
  - Formatted currency displays ($X.XX) and responsive cards.
- **Dynamic Filtering & Search**:
  - Filter by category (`All`, `Food`, `Transport`, `Bills`, `Shopping`, `Other`).
  - Filter by starred transactions only.
  - Real-time case-insensitive keyword search in both `title` and `note`.
  - One-click clear all filters.
- **Real-Time Analytics & Summary**:
  - Total expense amount, total entry count, and starred items count.
  - Category breakdown with percentages, item counts, and totals.
  - Breakdown sorted by total descending, with deterministic tie-breaker priority: `Food`, `Transport`, `Bills`, `Shopping`, `Other`.
- **Modern Responsive Design**:
  - Built with Tailwind CSS and ShadCN UI (`components.json`, Button, Input, Card, Badge).
  - Fully responsive across mobile (375px without horizontal scrolling) and desktop (1280px).

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma ORM
- **UI Components**: ShadCN UI + Tailwind CSS + Lucide Icons
- **State Management**: React Context (`AuthProvider` & `ExpenseProvider`)
- **Deployment**: Vercel

## 📦 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── register/route.ts
│   │   └── expenses/
│   │       ├── [id]/route.ts
│   │       ├── summary/route.ts
│   │       └── route.ts
│   ├── expenses/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── expenses/
│   │   ├── EditExpenseModal.tsx
│   │   ├── ExpenseFilters.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   └── ExpenseSummary.tsx
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── Navbar.tsx
│   └── Providers.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ExpenseContext.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validations.ts
├── prisma/
│   └── schema.prisma
├── components.json
├── package.json
└── tsconfig.json
```

## ⚙️ Environment Configuration

Configure your environment in `.env` based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
AUTH_SECRET="your-secure-jwt-auth-secret-key"
```

## 🏃 Local Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Synchronize database schema:
   ```bash
   npx prisma db push
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
