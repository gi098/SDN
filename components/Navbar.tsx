"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LogIn, CheckSquare, LogOut, LayoutDashboard, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import NotificationBell from "@/components/NotificationBell";
import { useLanguage } from "@/lib/languageContext";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#070a12]/80 border-b border-white/10 shadow-2xl transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex-shrink-0 relative z-20">
          <Logo href="/" size="md" showSubtitle={false} />
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 flex-1 px-4">
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <Link
              href="/"
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                pathname === "/"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>{t("navTasks")}</span>
            </Link>

            <Link
              href="/teams"
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                pathname.startsWith("/teams") || pathname.startsWith("/dashboard")
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t("navTeams")}</span>
            </Link>
          </div>
        </nav>

        {/* Right: User Controls & Utility */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative z-20">
          
          <div className="hidden xl:flex items-center mr-1">
             {session?.user && (
               <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 shadow-sm hover:border-cyan-500/40 transition-all">
                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">
                   {session.user.name?.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex flex-col max-w-[180px]">
                   <span className="text-xs font-bold text-slate-200 truncate leading-tight">
                     {session.user.name}
                   </span>
                   <span className="text-[10px] font-medium text-slate-400 truncate leading-tight">
                     {session.user.email}
                   </span>
                 </div>
               </div>
             )}
          </div>

          <div className="hidden xl:block h-6 w-[1px] bg-slate-800 mx-1" />

          {/* Nav links for smaller screens (under lg) */}
          <div className="flex lg:hidden items-center gap-1 mr-1">
             <Link href="/" className={`p-2 rounded-xl transition-colors ${pathname === "/" ? "bg-cyan-500/15 text-cyan-400" : "text-slate-400 hover:bg-slate-800"}`}>
               <CheckSquare className="w-5 h-5" />
             </Link>
             <Link href="/teams" className={`p-2 rounded-xl transition-colors ${pathname.startsWith("/teams") || pathname.startsWith("/dashboard") ? "bg-cyan-500/15 text-cyan-400" : "text-slate-400 hover:bg-slate-800"}`}>
               <LayoutDashboard className="w-5 h-5" />
             </Link>
          </div>

          <NotificationBell />
          <LanguageToggle />

          {!session ? (
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white theme-gradient-btn hover:scale-105 active:scale-95 transition-all shadow-md ml-1"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{t("navSignIn")}</span>
            </Link>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ml-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
