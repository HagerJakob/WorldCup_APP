import { Navigate, Route, Routes } from "react-router-dom";
import { FavoritenBereich } from "./components/FavoritenBereich";
import { KoRundenBereich } from "./components/KoRundenBereich";
import { Navigation } from "./components/Navigation";
import { SpieleBereich } from "./components/SpieleBereich";
import { StartseitenUebersicht } from "./components/StartseitenUebersicht";
import { TabellenBereich } from "./components/TabellenBereich";

export function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[#63f0d5]/30 bg-[rgba(0,70,56,0.82)] px-3 py-3 text-white shadow-[0_18px_70px_rgba(0,31,25,0.34)] backdrop-blur-2xl sm:px-6 sm:py-4 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <img src="/wm-ball.svg" alt="WM 2026" width={52} height={52} className="h-11 w-11 shrink-0 sm:h-[52px] sm:w-[52px]" />
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#b7f200] sm:text-xs sm:tracking-[0.34em]">FIFA World Cup 2026</p>
                <h1 className="mt-0.5 truncate text-xl font-black tracking-tight text-white sm:mt-1 sm:text-3xl">Spielplan & Tabellen</h1>
              </div>
            </div>
            <div className="hidden rounded-full border border-[#63f0d5]/35 bg-[#63f0d5]/12 px-4 py-2 text-sm font-semibold text-[#efffe8] shadow-[0_0_32px_rgba(99,240,213,0.2)] md:flex">Powered by football-data.org</div>
          </div>
          <Navigation />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
        <Routes>
          <Route path="/" element={<StartseitenUebersicht />} />
          <Route path="/spielplan" element={<SpielplanSeite />} />
          <Route path="/tabelle" element={<TabelleSeite />} />
          <Route path="/ko-runden" element={<KoRundenSeite />} />
          <Route path="/favoriten" element={<FavoritenSeite />} />
          <Route path="/einstellungen" element={<EinstellungenSeite />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function SpielplanSeite() {
  return (
    <section className="space-y-4 sm:space-y-6">
      <Hero eyebrow="Vollständiger Spielplan" title="Alle WM-Spiele chronologisch">
        Der gesamte Spielplan ist nach Tagen sortiert und die Filter helfen beim schnellen Wechsel zwischen den Ansichten.
      </Hero>
      <SpieleBereich bereich="alle" />
    </section>
  );
}

function KoRundenSeite() {
  return (
    <section className="space-y-4 sm:space-y-6">
      <Hero eyebrow="KO-Runden" title="Turnierbaum der WM 2026">
        Vom Sechzehntelfinale bis zum Finale, inklusive FIFA-Zuordnung der acht besten Gruppendritten.
      </Hero>
      <KoRundenBereich />
    </section>
  );
}

function FavoritenSeite() {
  return (
    <section className="space-y-4 sm:space-y-6">
      <Hero eyebrow="Favoriten" title="Welche Teams unterstützt du?">
        Setze ein Herz bei den Mannschaften, die du bei der WM 2026 unterstützen willst.
      </Hero>
      <FavoritenBereich />
    </section>
  );
}

function TabelleSeite() {
  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="scharf-karte rounded-[1.35rem] p-5 sm:rounded-[1.75rem] sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--farb-primary)]">Gruppentabelle</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Alle Gruppen A bis L</h2>
        <p className="mt-3 text-base leading-7 text-slate-700 sm:mt-4 sm:text-lg sm:leading-8">Die Tabelle ist am Handy kompakt und am Desktop vollständig lesbar.</p>
      </div>
      <TabellenBereich />
    </section>
  );
}

function EinstellungenSeite() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="scharf-karte rounded-[1.35rem] p-5 sm:rounded-[1.75rem] sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--farb-primary)]">Einstellungen</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Weniger Ablenkung, mehr Übersicht</h2>
        <div className="mt-5 space-y-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
          <p>Die App folgt automatisch dem Hell-Dunkel-Modus des Systems.</p>
          <p>Alle Zeiten werden in Mitteleuropäischer Zeit angezeigt.</p>
          <p>Die Kalenderdatei kann bei jedem Spiel direkt geöffnet werden.</p>
        </div>
      </div>
      <div className="scharf-karte flex items-center justify-center rounded-[1.35rem] p-6 sm:rounded-[1.75rem] sm:p-8">
        <div className="text-center">
          <img src="/wm-ball.svg" alt="WM 2026 Symbol" width={140} height={140} className="mx-auto" />
          <p className="mt-4 text-lg font-bold text-slate-900">Verlässliche Darstellung</p>
          <p className="mt-2 text-base leading-7 text-slate-600">Große Schriften, starke Kontraste und klare Karten.</p>
        </div>
      </div>
    </section>
  );
}

function Hero({ eyebrow, title, children }: { eyebrow: string; title: string; children: string }) {
  return (
    <div className="glas-karte rounded-[1.35rem] p-5 text-white sm:rounded-[1.75rem] sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70 sm:text-sm sm:tracking-[0.28em]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-white/80 sm:mt-4 sm:text-lg sm:leading-8">{children}</p>
    </div>
  );
}
