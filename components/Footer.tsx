"use client";

import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-sky-100 bg-white/75 backdrop-blur-xl transition-colors py-8 shadow-xs">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Logo size="md" title="ExpenseTrail" subtitle="Next-Gen Personal Expense Tracker" layout="row" />
          </div>

          <div className="text-xs text-slate-500 font-medium" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} ExpenseTrail SDN302. Powered by Next.js, TypeScript, Prisma & Supabase.
          </div>
        </div>
      </div>
    </footer>
  );
}
