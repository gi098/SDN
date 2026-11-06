import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DreamyCloudsBackground } from "@/components/DreamyCloudsBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExpenseTrail – Personal Expense Tracker",
  description:
    "Next-gen personal expense tracking and financial management platform connected to Supabase PostgreSQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#fdfbf7] text-slate-900 antialiased selection:bg-rose-500/20 selection:text-rose-700 relative"
      >
        <DreamyCloudsBackground />
        <Providers>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
