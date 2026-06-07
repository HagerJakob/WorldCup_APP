import { SpieleMitFilter } from "@/components/SpieleBereich";

export default function SpielplanSeite() {
  return (
    <section className="space-y-6">
      <div className="scharf-karte rounded-[1.75rem] border border-slate-200 p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--farb-primary)]">Vollständiger Spielplan</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Alle WM-Spiele chronologisch</h2>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Der gesamte Spielplan ist nach Tagen sortiert. Mit den Filtern lässt sich Deutschland, Österreich oder die Favoritenliste oben halten.
        </p>
      </div>

      <SpieleMitFilter bereich="alle" />
    </section>
  );
}
