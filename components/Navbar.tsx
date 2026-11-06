"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, Wallet, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-sky-100 shadow-[0_4px_20px_rgba(2,132,199,0.04)] transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex-shrink-0 relative z-20">
          <Logo href="/" size="md" showSubtitle={false} />
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 flex-1 px-4">
          <div className="flex items-center gap-1.5 bg-sky-50/70 p-1.5 rounded-2xl border border-sky-100 shadow-xs backdrop-blur-md">
            <Link
              href="/"
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                pathname === "/"
                  ? "bg-white text-sky-600 border border-sky-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Wallet className="w-4 h-4 text-sky-500" />
              <span>Home</span>
            </Link>

            {!loading && user && (
              <Link
                href="/expenses"
                data-testid="link-expenses"
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  pathname.startsWith("/expenses")
                    ? "bg-white text-sky-600 border border-sky-200/80 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Wallet className="w-4 h-4 text-cyan-500" />
                <span>Expenses</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Right: User Controls & Utility */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative z-20">
          
          {!loading && user ? (
            <>
              {/* Desktop User Email Badge */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/90 border border-sky-100 shadow-xs hover:border-sky-300 transition-all backdrop-blur-md">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col max-w-[180px]">
                  <span
                    data-testid="user-email"
                    className="text-xs font-bold text-slate-800 truncate leading-tight"
                  >
                    {user.email}
                  </span>
                  <span className="text-[10px] font-semibold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent truncate leading-tight">
                    Active Session
                  </span>
                </div>
              </div>

              {/* Mobile Expenses Link */}
              <Link
                href="/expenses"
                className="flex lg:hidden items-center p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              >
                <Wallet className="w-5 h-5" />
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                data-testid="btn-logout"
                onClick={logout}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-200 transition-all cursor-pointer shadow-xs bg-white/70"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                data-testid="btn-login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white border border-sky-100 shadow-xs transition-all backdrop-blur-md"
              >
                <LogIn className="w-4 h-4 text-sky-500" />
                <span>Login</span>
              </Link>

              <Link
                href="/register"
                data-testid="btn-register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white theme-gradient-btn hover:scale-105 active:scale-95 transition-all shadow-[0_4px_16px_rgba(2,132,199,0.35)] cursor-pointer"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
