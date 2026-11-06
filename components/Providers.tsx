"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReadingLogProvider } from "@/contexts/ReadingLogContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReadingLogProvider>{children}</ReadingLogProvider>
    </AuthProvider>
  );
}
