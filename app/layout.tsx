import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WinterFrostBackground } from "@/components/WinterFrostBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadLog – Personal Reading Tracker",
  description:
    "Next-gen personal reading log and habit tracking platform connected to Supabase PostgreSQL.",
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
        className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 antialiased selection:bg-sky-500/20 selection:text-sky-700 relative"
      >
        <WinterFrostBackground />
        <Providers>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
