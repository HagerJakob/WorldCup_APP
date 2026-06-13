import { useMemo, useState } from "react";
import { istFavoritenSpiel } from "../favoriten";
import { tagInWien } from "../format";
import { useFavoritenTeams } from "../hooks/useFavoritenTeams";
import { useSpiele } from "../hooks/useSpiele";
import { LadePlatzhalter } from "./LadePlatzhalter";
import { SpielKarte } from "./SpielKarte";

type StartseitenAnsicht = "favoriten" | "heute" | "datum" | "naechste";

const fussballFakten = [
  "Brasilien ist das einzige Land, das seit der ersten WM 1930 an jeder Weltmeisterschaft teilgenommen hat.",
  "Pelé ist der einzige Spieler, der drei Weltmeistertitel gewann.",
  "Miroslav Klose ist mit 16 Treffern Rekordtorschütze der WM-Geschichte.",
  "Die erste Fußball-WM fand 1930 in Uruguay statt.",
  "Die WM 2026 in den USA, Kanada und Mexiko wird erstmals mit 48 Teams ausgetragen.",
  "Marokko wurde 2022 als erstes afrikanisches Team WM-Halbfinalist.",
  "Deutschland besiegte Brasilien im Halbfinale der WM 2014 mit 7:1.",
  "Lionel Messi gewann mit Argentinien die WM 2022 in Katar."
];

function istHeuteInWien(zeitpunkt: string | Date) {
  return tagInWien(zeitpunkt) === tagInWien(new Date());
}

function sortiereNachAnpfiff<T extends { anpfiff: string }>(spiele: T[]) {
  return [...spiele].sort((a, b) => new Date(a.anpfiff).getTime() - new Date(b.anpfiff).getTime());
}

export function StartseitenUebersicht() {
  const [ansicht, setAnsicht] = useState<StartseitenAnsicht>("heute");
  const [datum, setDatum] = useState(() => new Date().toISOString().slice(0, 10));
  const { spiele, istLadend, fehler } = useSpiele({ bereich: "alle" });
  const { favoritenSet } = useFavoritenTeams();
  const fussballfakt = fussballFakten[new Date().getDate() % fussballFakten.length];

  const gefilterteSpiele = useMemo(() => {
    const sortierteSpiele = sortiereNachAnpfiff(spiele);

    if (ansicht === "heute") return sortierteSpiele.filter((spiel) => istHeuteInWien(spiel.anpfiff)).slice(0, 4);
    if (ansicht === "datum") return sortierteSpiele.filter((spiel) => tagInWien(spiel.anpfiff) === tagInWien(new Date(datum))).slice(0, 4);
    if (ansicht === "naechste") return sortierteSpiele.filter((spiel) => new Date(spiel.anpfiff).getTime() >= Date.now()).slice(0, 4);
    return sortierteSpiele.filter((spiel) => istFavoritenSpiel(spiel, favoritenSet)).slice(0, 4);
  }, [ansicht, datum, favoritenSet, spiele]);

  if (fehler) {
    return (
      <div className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8">
        <p className="text-2xl font-black">Die Startseite konnte nicht geladen werden.</p>
        <p className="mt-2 text-lg text-white/80">Bitte später noch einmal versuchen.</p>
      </div>
    );
  }

  if (istLadend) return <LadePlatzhalter zeilen={4} />;

  return (
    <section className="space-y-6">
      <div className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">Fußballfakt des Tages</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">{fussballfakt}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">Unterhalb kannst du zwischen Favoriten, Heute und Nächste Spiele wählen.</p>

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
                className={`min-h-12 rounded-full px-5 py-3 text-sm font-black transition sm:text-base ${aktiv ? "bg-white text-[var(--farb-primary)]" : "border border-white/15 bg-white/10 text-white/85 hover:bg-white/15"}`}
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
            <input id="startseiten-datum" type="date" value={datum} onChange={(event) => setDatum(event.target.value)} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base font-semibold text-white outline-none ring-0" />
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
            />
          ))
        ) : (
          <div className="glas-karte rounded-[1.75rem] p-6 text-white sm:p-8 md:col-span-2">
            <p className="text-xl font-black">Keine Spiele für diese Auswahl.</p>
            <p className="mt-2 text-white/80">Wähle Favoriten aus oder nutze eine andere Ansicht.</p>
          </div>
        )}
      </div>
    </section>
  );
}
