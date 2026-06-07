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
          <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-72 md:flex-col md:bg-[linear-gradient(180deg,#0f1f33_0%,#15365d_100%)] md:px-6 md:py-8 md:text-white">
            <div className="mb-10 flex items-center gap-4">
              <Image src="/wm-ball.svg" alt="WM 2026" width={52} height={52} priority />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/75">WM 2026</p>
                <p className="text-lg font-bold text-white">Spielplan für die Familie</p>
              </div>
            </div>
            <p className="mb-8 text-base leading-7 text-white/75">
              Alle Spiele groß, klar und ohne technische Hürden. Live-Infos, Tabellen und Favoriten immer griffbereit.
            </p>
            <Navigation />
          </aside>

          <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
            <header className="mb-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(23,59,104,0.98)_0%,rgba(15,23,42,0.98)_60%,rgba(199,31,61,0.92)_100%)] p-6 text-white shadow-[0_16px_50px_rgba(15,23,42,0.14)] md:ml-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">FIFA Fußball-Weltmeisterschaft 2026</p>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Ein klarer Überblick für alle Spiele
                  </h1>
                </div>
                <div className="hidden items-center gap-3 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white backdrop-blur md:flex">
                  <span className="h-3 w-3 rounded-full bg-[#ff8f98] shadow-[0_0_0_6px_rgba(255,255,255,0.12)]" />
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
