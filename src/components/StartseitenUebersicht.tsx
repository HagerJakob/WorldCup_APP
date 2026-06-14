import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFavoritenTeams } from "../hooks/useFavoritenTeams";

const fussballFakten = [
  "Brasilien ist das einzige Land, das seit der ersten WM 1930 an jeder Weltmeisterschaft teilgenommen hat.",
  "Pele ist der einzige Spieler, der drei Weltmeistertitel gewann.",
  "Miroslav Klose ist mit 16 Treffern Rekordtorschuetze der WM-Geschichte.",
  "Die erste Fussball-WM fand 1930 in Uruguay statt.",
  "Die WM 2026 in den USA, Kanada und Mexiko wird erstmals mit 48 Teams ausgetragen.",
  "Marokko wurde 2022 als erstes afrikanisches Team WM-Halbfinalist.",
  "Deutschland besiegte Brasilien im Halbfinale der WM 2014 mit 7:1.",
  "Lionel Messi gewann mit Argentinien die WM 2022 in Katar."
];

const wmStart = new Date("2026-06-11T00:00:00-05:00");

const dashboardKarten = [
  {
    titel: "48 Teams",
    text: "Zwoelf Gruppen mit je vier Mannschaften.",
    farbe: "from-[#63f0d5]/24 to-[#0057ff]/18"
  },
  {
    titel: "104 Spiele",
    text: "Von der Gruppenphase bis zum Finale.",
    farbe: "from-[#ff3d14]/24 to-[#e60000]/18"
  },
  {
    titel: "16 KO-Pfade",
    text: "Der Turnierbaum entsteht automatisch aus Tabelle und API.",
    farbe: "from-[#b7f200]/24 to-[#6b00f5]/16"
  }
];

const schnellzugriffe = [
  { label: "Spielplan", href: "/spielplan", beschreibung: "Alle Matches chronologisch" },
  { label: "Tabellen", href: "/tabelle", beschreibung: "Gruppen A bis L" },
  { label: "KO-Runden", href: "/ko-runden", beschreibung: "Turnierbaum ansehen" },
  { label: "Favoriten", href: "/favoriten", beschreibung: "Teams markieren" }
];

const gastgeber = [
  { land: "Kanada", farbe: "bg-[#e60000]/18", detail: "Toronto & Vancouver" },
  { land: "USA", farbe: "bg-[#0057ff]/18", detail: "Elf Gastgeber-Staedte" },
  { land: "Mexiko", farbe: "bg-[#b7f200]/16", detail: "Mexiko-Stadt, Guadalajara, Monterrey" }
];

function berechneTageBisStart() {
  const differenz = wmStart.getTime() - Date.now();
  return Math.max(0, Math.ceil(differenz / (1000 * 60 * 60 * 24)));
}

export function StartseitenUebersicht() {
  const [faktenIndex, setFaktenIndex] = useState(() => new Date().getDate() % fussballFakten.length);
  const [tageBisStart, setTageBisStart] = useState(berechneTageBisStart);
  const { favoritenIds } = useFavoritenTeams();
  const fussballfakt = fussballFakten[faktenIndex];
  const favoritenText = useMemo(() => {
    if (favoritenIds.length === 0) return "Noch kein Team ausgewaehlt";
    if (favoritenIds.length === 1) return "1 Team ausgewaehlt";
    return `${favoritenIds.length} Teams ausgewaehlt`;
  }, [favoritenIds.length]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFaktenIndex((index) => (index + 1) % fussballFakten.length);
      setTageBisStart(berechneTageBisStart());
    }, 15000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="glas-karte rounded-[1.35rem] p-5 text-white sm:rounded-[1.75rem] sm:p-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b7f200] sm:text-sm sm:tracking-[0.28em]">Powered by football-data.org</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Deine WM-Zentrale</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-white/80 sm:mt-4 sm:text-lg sm:leading-8">Fakten, Countdown, Favoriten und schnelle Wege zu Spielplan, Tabellen und KO-Baum.</p>
          </div>
          <div className="rounded-[1.2rem] border border-white/15 bg-white/10 p-4 text-left backdrop-blur sm:rounded-[1.5rem] sm:p-5 sm:text-right">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/65">Start in</p>
            <p className="mt-2 text-5xl font-black leading-none sm:text-6xl">{tageBisStart}</p>
            <p className="mt-1 text-lg font-black text-white/80">Tagen</p>
          </div>
        </div>
        <div className="mt-5 rounded-[1.2rem] border border-white/12 bg-white/8 p-4 sm:mt-6 sm:rounded-[1.5rem] sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70 sm:text-sm sm:tracking-[0.28em]">Fussballfakt</p>
          <h3 key={faktenIndex} className="wm-fakt-wechsel mt-3 text-xl font-black tracking-tight text-white sm:text-3xl">
            {fussballfakt}
          </h3>
          <p className="mt-3 text-base leading-7 text-white/72">Wechselt automatisch alle 15 Sekunden.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glas-karte rounded-[1.35rem] p-5 text-white sm:rounded-[1.75rem] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b7f200] sm:text-sm sm:tracking-[0.28em]">Turnierstart</p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <span className="text-6xl font-black leading-none tracking-tight sm:text-8xl">{tageBisStart}</span>
            <div className="pb-2">
              <p className="text-2xl font-black">Tage</p>
              <p className="mt-1 text-base font-semibold text-white/75">bis zum WM-Auftakt am 11. Juni 2026</p>
            </div>
          </div>
        </div>

        <div className="glas-karte rounded-[1.35rem] p-5 text-white sm:rounded-[1.75rem] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#63f0d5] sm:text-sm sm:tracking-[0.28em]">Deine WM</p>
          <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{favoritenText}</h3>
          <p className="mt-3 text-base leading-7 text-white/78">Markiere Teams mit Herz, dann kannst du ihre Spiele gezielt im Favoritenbereich verfolgen.</p>
          <Link to="/favoriten" className="wm-aktionsbutton mt-5 inline-flex rounded-full px-5 py-3 text-sm font-black">
            Favoriten bearbeiten
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {gastgeber.map((eintrag) => (
          <article key={eintrag.land} className={`glas-karte rounded-[1.25rem] ${eintrag.farbe} p-4 text-white sm:rounded-[1.5rem] sm:p-5`}>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/60">Gastgeber</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">{eintrag.land}</h3>
            <p className="mt-2 text-base font-semibold text-white/75">{eintrag.detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {dashboardKarten.map((karte) => (
          <article key={karte.titel} className={`glas-karte rounded-[1.25rem] bg-gradient-to-br ${karte.farbe} p-4 text-white sm:rounded-[1.5rem] sm:p-5`}>
            <p className="text-3xl font-black tracking-tight">{karte.titel}</p>
            <p className="mt-3 text-base font-semibold leading-7 text-white/78">{karte.text}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {schnellzugriffe.map((link) => (
          <Link key={link.href} to={link.href} className="scharf-karte rounded-[1.15rem] p-3 transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(0,40,32,0.3)] sm:rounded-[1.25rem] sm:p-4">
            <p className="text-lg font-black text-slate-950">{link.label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{link.beschreibung}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
