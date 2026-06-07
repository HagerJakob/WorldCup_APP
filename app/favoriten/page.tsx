import { SpieleMitFilter } from "@/components/SpieleBereich";

export default function FavoritenSeite() {
  return (
    <section className="space-y-6">
      <div className="scharf-karte rounded-[1.75rem] border border-slate-200 p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--farb-primary)]">Favoriten</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Österreich und Deutschland zuerst</h2>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Hier werden die Lieblingsmannschaften gebündelt angezeigt, damit die wichtigsten Spiele schnell gefunden werden.
        </p>
      </div>

      <SpieleMitFilter bereich="favoriten" />
    </section>
  );
}
