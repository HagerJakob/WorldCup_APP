import { SpieleMitFilter } from "@/components/SpieleBereich";

export default function Startseite() {
  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">Heute</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Die heutigen Spiele auf einen Blick</h2>
          <p className="mt-4 text-lg leading-8 text-white/80">
            Die wichtigsten Spiele des Tages werden hier groß angezeigt, damit niemand lange suchen muss.
          </p>
        </article>
        <article className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">Nächste Spiele</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Direkt die nächsten Begegnungen</h2>
          <p className="mt-4 text-lg leading-8 text-white/80">
            So bleibt der Blick nach vorne einfach und übersichtlich, ohne zusätzliche Menüs.
          </p>
        </article>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Heutige Spiele</h2>
          <SpieleMitFilter bereich="heute" />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Nächste Spiele</h2>
          <SpieleMitFilter bereich="naechste" />
        </section>
      </div>
    </section>
  );
}
