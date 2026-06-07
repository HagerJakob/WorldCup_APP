import Image from "next/image";

export default function EinstellungenSeite() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="scharf-karte rounded-[1.75rem] border border-slate-200 p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--farb-primary)]">Einstellungen</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Weniger Ablenkung, mehr Übersicht</h2>
        <div className="mt-5 space-y-4 text-lg leading-8 text-slate-700">
          <p>Die App folgt automatisch dem Hell-Dunkel-Modus des Systems.</p>
          <p>Alle Zeiten werden in Mitteleuropäischer Zeit angezeigt.</p>
          <p>Die Kalenderdatei kann bei jedem Spiel direkt geöffnet werden.</p>
        </div>
      </div>

      <div className="scharf-karte flex items-center justify-center rounded-[1.75rem] border border-slate-200 p-8">
        <div className="text-center">
          <Image src="/wm-ball.svg" alt="WM 2026 Symbol" width={140} height={140} className="mx-auto" priority />
          <p className="mt-4 text-lg font-bold text-slate-900">Verlässliche Darstellung</p>
          <p className="mt-2 text-base leading-7 text-slate-600">Große Schriften, starke Kontraste und klare Karten.</p>
        </div>
      </div>
    </section>
  );
}
