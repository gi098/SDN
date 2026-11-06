"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ReadingLogForm } from "@/components/reading-logs/ReadingLogForm";
import { ReadingLogSummary } from "@/components/reading-logs/ReadingLogSummary";
import { ReadingLogFilters } from "@/components/reading-logs/ReadingLogFilters";
import { ReadingLogList } from "@/components/reading-logs/ReadingLogList";
import { Loader2 } from "lucide-react";

export default function ReadingLogsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="flex flex-col items-center space-y-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          <p className="text-xs font-semibold">Loading reading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      data-testid="reading-logs-page"
      className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 w-full relative"
    >
      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-sky-100 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reading Dashboard
          </h1>
        </div>
      </div>

      {/* Responsive Grid: Form & Summary on left, Filters & List on right */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Summary */}
        <div className="xl:col-span-5 space-y-6 order-2 xl:order-1">
          <ReadingLogForm />
          <ReadingLogSummary />
        </div>

        {/* Right Column: Filters & Reading List */}
        <div className="xl:col-span-7 space-y-4 order-1 xl:order-2">
          <ReadingLogFilters />
          <ReadingLogList />
        </div>
      </div>
    </div>
  );
}

