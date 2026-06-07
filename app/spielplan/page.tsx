import { SpieleMitFilter } from "@/components/SpieleBereich";

export default function SpielplanSeite() {
  return (
    <section className="space-y-6">
      <div className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">Vollständiger Spielplan</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Alle WM-Spiele chronologisch</h2>
        <p className="mt-4 text-lg leading-8 text-white/80">
          Der gesamte Spielplan ist nach Tagen sortiert und die Filter helfen beim schnellen Wechsel zwischen den Ansichten.
        </p>
      </div>

      <SpieleMitFilter bereich="alle" />
    </section>
  );
}
