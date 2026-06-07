import { TabellenBereich } from "@/components/TabellenBereich";

export default function TabelleSeite() {
  return (
    <section className="space-y-6">
      <div className="scharf-karte rounded-[1.75rem] border border-slate-200 p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--farb-primary)]">Gruppentabelle</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Alle Gruppen A bis L</h2>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Die Tabelle ist bewusst groß gesetzt, damit Platzierung, Punkte und Tordifferenz sofort erkennbar sind.
        </p>
      </div>

      <TabellenBereich />
    </section>
  );
}
