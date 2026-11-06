import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/languageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus – Modern Workspace & Task Platform",
  description:
    "Enterprise-grade collaborative workspace and task management system built with Next.js, TypeScript, Tailwind CSS, Prisma ORM, and Supabase.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-[#070a12] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950`}
        suppressHydrationWarning
      >
        <Providers>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                },
              }}
            />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
