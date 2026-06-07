"use client";

import { useMemo, useState } from "react";
import { useSpiele } from "@/hooks/useSpiele";
import { SpielKarte } from "@/components/SpielKarte";
import { LadePlatzhalter } from "@/components/LadePlatzhalter";

type StartseitenAnsicht = "favoriten" | "heute" | "datum" | "naechste";

function tagInWien(zeitpunkt: string | Date) {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(zeitpunkt));
}

function istHeuteInWien(zeitpunkt: string | Date) {
  return tagInWien(zeitpunkt) === tagInWien(new Date());
}

function sortiereNachAnpfiff(spiele: Array<{ anpfiff: string }>) {
  return [...spiele].sort((erstes, zweites) => new Date(erstes.anpfiff).getTime() - new Date(zweites.anpfiff).getTime());
}

export function StartseitenUebersicht() {
  const [ansicht, setAnsicht] = useState<StartseitenAnsicht>("heute");
  const [datum, setDatum] = useState(() => new Date().toISOString().slice(0, 10));
  const { spiele, istLadend, fehler } = useSpiele({ bereich: "alle" });

  const gefilterteSpiele = useMemo(() => {
    const sortierteSpiele = sortiereNachAnpfiff(spiele);

    if (ansicht === "heute") {
      return sortierteSpiele.filter((spiel) => istHeuteInWien(spiel.anpfiff)).slice(0, 4);
    }

    if (ansicht === "datum") {
      const zielTag = new Intl.DateTimeFormat("de-AT", {
        timeZone: "Europe/Vienna",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date(datum));

      return sortierteSpiele.filter((spiel) => tagInWien(spiel.anpfiff) === zielTag).slice(0, 4);
    }

    if (ansicht === "naechste") {
      return sortierteSpiele.filter((spiel) => new Date(spiel.anpfiff).getTime() >= Date.now()).slice(0, 4);
    }

    const favoriten = sortierteSpiele.filter((spiel) => {
      const text = `${spiel.heimTeam.name} ${spiel.gastTeam.name}`.toLowerCase();
      return text.includes("deutschland") || text.includes("germany") || text.includes("österreich") || text.includes("osterreich") || text.includes("austria");
    });

    return favoriten.slice(0, 4);
  }, [ansicht, datum, spiele]);

  if (fehler) {
    return (
      <div className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8">
        <p className="text-2xl font-black">Die Startseite konnte nicht geladen werden.</p>
        <p className="mt-2 text-lg text-white/80">Bitte später noch einmal versuchen.</p>
      </div>
    );
  }

  if (istLadend) {
    return <LadePlatzhalter zeilen={4} />;
  }

  return (
    <section className="space-y-6">
      <div className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">Startseite</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Auswahl zwischen Favoriten, Heute, Datum und Nächste Spiele</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
          Es werden immer maximal vier Spiele angezeigt. Die Kacheln sind bewusst in einer 2x2-Anordnung gehalten.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { wert: "favoriten", label: "Favoriten" },
            { wert: "heute", label: "Heute" },
            { wert: "datum", label: "Datum" },
            { wert: "naechste", label: "Nächste Spiele" }
          ].map((eintrag) => {
            const aktiv = ansicht === eintrag.wert;

            return (
              <button
                key={eintrag.wert}
                type="button"
                onClick={() => setAnsicht(eintrag.wert as StartseitenAnsicht)}
                className={`min-h-12 rounded-full px-5 py-3 text-sm font-black transition sm:text-base ${
                  aktiv ? "bg-white text-[var(--farb-primary)]" : "border border-white/15 bg-white/10 text-white/85 hover:bg-white/15"
                }`}
              >
                {eintrag.label}
              </button>
            );
          })}
        </div>

        {ansicht === "datum" ? (
          <div className="mt-5 max-w-xs">
            <label className="mb-2 block text-sm font-semibold text-white/70" htmlFor="startseiten-datum">
              Tag auswählen
            </label>
            <input
              id="startseiten-datum"
              type="date"
              value={datum}
              onChange={(ereignis) => setDatum(ereignis.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base font-semibold text-white outline-none ring-0 placeholder:text-white/50"
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {gefilterteSpiele.length ? (
          gefilterteSpiele.map((spiel) => (
            <SpielKarte
              key={spiel.id}
              heimTeam={spiel.heimTeam.name}
              gastTeam={spiel.gastTeam.name}
              heimFlagge={spiel.heimTeam.flagge ?? "🏳️"}
              gastFlagge={spiel.gastTeam.flagge ?? "🏳️"}
              anpfiff={spiel.anpfiff}
              status={spiel.status}
              heimTore={spiel.heimTore}
              gastTore={spiel.gastTore}
              minute={spiel.minute}
              stadion={spiel.stadion}
              gruppe={spiel.gruppe}
              kalenderHref={`/api/kalender/${spiel.id}`}
            />
          ))
        ) : (
          <div className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8 md:col-span-2">
            <p className="text-xl font-black">Keine Spiele für diese Auswahl.</p>
            <p className="mt-2 text-white/80">Wähle eine andere Ansicht oder ein anderes Datum.</p>
          </div>
        )}
      </div>
    </section>
  );
}