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
      <body className={`${bodySchrift.variable} ${titelSchrift.variable} bg-white text-slate-900 antialiased`}>
        <div className="min-h-screen pb-24 md:pb-0 md:pl-72">
          <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-72 md:flex-col md:border-r md:border-slate-200 md:bg-white/90 md:px-6 md:py-8">
            <div className="mb-10 flex items-center gap-4">
              <Image src="/wm-ball.svg" alt="WM 2026" width={52} height={52} priority />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--farb-primary)]">WM 2026</p>
                <p className="text-lg font-bold text-slate-900">Spielplan für die Familie</p>
              </div>
            </div>
            <p className="mb-8 text-base leading-7 text-slate-700">
              Alle Spiele groß, klar und ohne technische Hürden. Live-Infos, Tabellen und Favoriten immer griffbereit.
            </p>
            <Navigation />
          </aside>

          <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
            <header className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_rgba(16,35,63,0.06)] md:ml-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--farb-primary)]">FIFA Fußball-Weltmeisterschaft 2026</p>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    Ein klarer Überblick für alle Spiele
                  </h1>
                </div>
                <div className="hidden items-center gap-3 rounded-full bg-[var(--farb-karton)] px-4 py-2 text-sm font-semibold text-slate-700 md:flex">
                  <span className="h-3 w-3 rounded-full bg-[var(--farb-akzent)] shadow-[0_0_0_6px_rgba(215,38,56,0.12)]" />
                  Live-freundlich
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>

          <div className="md:hidden">
            <Navigation />
          </div>
        </div>
      </body>
    </html>
  );
}
