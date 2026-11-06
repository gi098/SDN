# NEXUS – Intelligent Workspace & Task Platform

**Nexus** is an enterprise-grade collaborative workspace and task management system built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** connected to a cloud **PostgreSQL database hosted on Supabase**.

## 🚀 Key Features

- **Modern Dark Architecture**: High-tech cyber aesthetic with obsidian glassmorphism, ambient glowing halos, and dynamic micro-animations.
- **Task Management**: Real-time CRUD operations, priority levels, status transitions, due date tracking, and instant search & multi-level filters.
- **Kanban Board & List Views**: Drag-and-drop workflow status advancement with interactive Kanban cards.
- **Collaborative Workspaces**: Multi-team organization with role-based access control (RBAC: Owner, Admin, Member).
- **Real-Time Synchronization**: Live sync for messages, task assignments, and activity audit trails via Supabase Realtime / SSE.
- **Bilingual Interface**: Native English and Vietnamese language support.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Database & Auth**: PostgreSQL on Supabase, NextAuth.js
- **ORM**: Prisma ORM

## 📦 Getting Started

1. Clone repository:
   ```bash
   git clone https://github.com/min098-ui/SDN.git
   cd SDN
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

4. Push schema to Supabase:
   ```bash
   npx prisma db push
   ```

5. Run development server:
   ```bash
   npm run dev
   ```
