"use client";

import Logo from "@/components/Logo";
import { useLanguage } from "@/lib/languageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#070a12]/90 backdrop-blur-md transition-colors py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Logo size="md" subtitle="Next-Gen Task & Workspace Orchestration" layout="row" />
          </div>

          <div className="text-xs text-slate-500 font-medium" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} NEXUS SDN. Powered by Next.js, TypeScript, Prisma & Supabase.
          </div>
        </div>
      </div>
    </footer>
  );
}
