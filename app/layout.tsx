import Image from "next/image";
import type { Metadata } from "next";
import { Manrope, Archivo } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const bodySchrift = Manrope({ subsets: ["latin"], variable: "--font-body" });
const titelSchrift = Archivo({ subsets: ["latin"], variable: "--font-title" });

export const metadata: Metadata = {
  title: "WM 2026 Spielplan",
  description: "Übersichtliche WM-2026-App für den Spielplan, Tabellen und Favoriten."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${bodySchrift.variable} ${titelSchrift.variable} bg-[radial-gradient(circle_at_top,rgba(23,59,104,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(199,31,61,0.08),transparent_22%),linear-gradient(180deg,#f7faff_0%,#eef3fb_100%)] text-slate-900 antialiased`}>
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-white/20 bg-[rgba(8,16,31,0.72)] px-4 py-4 text-white backdrop-blur-2xl sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Image src="/wm-ball.svg" alt="WM 2026" width={52} height={52} priority />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/65">WM 2026</p>
                    <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Spielplan & Tabellen</h1>
                  </div>
                </div>
                <div className="hidden rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white/85 shadow-[0_12px_35px_rgba(0,0,0,0.12)] md:flex">
                  Glasig, klar, kontrastreich
                </div>
              </div>
              <Navigation />
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
