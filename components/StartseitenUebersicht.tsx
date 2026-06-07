"use client";

import { useMemo, useState } from "react";
import { useSpiele } from "@/hooks/useSpiele";
import { SpielKarte } from "@/components/SpielKarte";
import { LadePlatzhalter } from "@/components/LadePlatzhalter";

type StartseitenAnsicht = "favoriten" | "heute" | "datum" | "naechste";

const fussballFakten = [
  "Brasilien ist das einzige Land, das seit der ersten WM 1930 an jeder Weltmeisterschaft teilgenommen hat.",
  "Pelé ist der einzige Spieler, der drei Weltmeistertitel gewann (1958, 1962 und 1970).",
  "Miroslav Klose erzielte zwischen 2002 und 2014 insgesamt 16 WM-Tore und ist damit Rekordtorschütze.",
  "Just Fontaine schoss bei der WM 1958 in Schweden 13 Tore - Rekord für ein einzelnes Turnier.",
  "Die erste Fußball-WM fand 1930 in Uruguay statt.",
  "Brasilien gewann die Weltmeisterschaft 1958, 1962, 1970, 1994 und 2002.",
  "Deutschland erreichte bisher acht WM-Finals (1954, 1966, 1974, 1982, 1986, 1990, 2002, 2014).",
  "Die Niederlande verloren die WM-Finals 1974, 1978 und 2010.",
  "Spanien wurde 2010 in Südafrika erstmals Weltmeister.",
  "Marokko wurde 2022 in Katar als erstes afrikanisches Team WM-Halbfinalist.",
  "Hakan Şükür erzielte bei der WM 2002 nach 10,8 Sekunden das schnellste WM-Tor der Geschichte.",
  "Die WM 2026 in den USA, Kanada und Mexiko wird erstmals mit 48 Teams ausgetragen.",
  "Italien gewann die Weltmeisterschaften 1934 und 1938 direkt hintereinander.",
  "Brasilien verteidigte seinen Titel erfolgreich bei den WMs 1958 und 1962.",
  "Kein Land konnte jemals drei Weltmeisterschaften in Folge gewinnen.",
  "Lionel Messi gewann mit Argentinien die WM 2022 in Katar.",
  "Kylian Mbappé erzielte im WM-Finale 2022 gegen Argentinien einen Hattrick.",
  "Die WMs 1942 und 1946 wurden wegen des Zweiten Weltkriegs abgesagt.",
  "Zwischen der WM 1938 und der WM 1950 lagen deshalb zwölf Jahre.",
  "England gewann seinen einzigen WM-Titel 1966 im eigenen Land.",
  "Kroatien erreichte 2018 in Russland erstmals ein WM-Finale.",
  "Deutschland besiegte Brasilien im Halbfinale der WM 2014 mit 7:1.",
  "Der höchste WM-Sieg war Ungarn gegen El Salvador (10:1) bei der WM 1982.",
  "Die heutige FIFA-Weltmeister-Trophäe wird seit der WM 1974 vergeben.",
  "Die originale Jules-Rimet-Trophäe wurde 1983 in Brasilien gestohlen und nie wiedergefunden.",
  "Pelé war beim WM-Sieg 1958 erst 17 Jahre und 249 Tage alt.",
  "Roger Milla war mit 42 Jahren und 39 Tagen der älteste WM-Torschütze (1994).",
  "Mexiko richtete die Weltmeisterschaften 1970, 1986 und 2026 aus.",
  "Die WM 2022 in Katar war die erste Weltmeisterschaft in einem arabischen Land.",
  "Die WM 2022 wurde erstmals im November und Dezember statt im Sommer gespielt.",
  "Argentinien gewann die WM 2022 nach einem 3:3 und Elfmeterschießen gegen Frankreich.",
  "Uruguay wurde 1930 erster Weltmeister der Geschichte.",
  "Frankreich gewann die Heim-WM 1998 durch ein 3:0 gegen Brasilien.",
  "England gewann das Finale 1966 gegen Deutschland mit 4:2 nach Verlängerung.",
  "Deutschland gewann die Heim-WM 1974 gegen die Niederlande mit 2:1.",
  "Deutschland gewann die WM 1990 in Italien durch ein 1:0 gegen Argentinien.",
  "Brasilien blieb bei der WM 2002 in sieben Spielen ungeschlagen.",
  "Die USA erreichten bei der ersten WM 1930 das Halbfinale.",
  "Südkorea erreichte als erstes asiatisches Team ein WM-Halbfinale (2002).",
  "Costa Rica erreichte bei der WM 2014 erstmals ein Viertelfinale.",
  "Kamerun war 1990 das erste afrikanische Team in einem WM-Viertelfinale.",
  "Nordkorea besiegte Italien bei der WM 1966 überraschend mit 1:0.",
  "Saudi-Arabien schlug bei der WM 2022 den späteren Weltmeister Argentinien mit 2:1.",
  "Miroslav Klose überholte 2014 Ronaldos Rekord von 15 WM-Toren.",
  "Diego Maradona führte Argentinien 1986 als Kapitän zum WM-Titel.",
  "Zinédine Zidane erzielte im WM-Finale 1998 zwei Kopfballtore.",
  "Spanien gewann bei der WM 2010 alle vier K.-o.-Spiele mit 1:0.",
  "Brasilien stand noch nie in einem WM-Finale, das im Elfmeterschießen entschieden wurde.",
  "Deutschland gewann seine vier WM-Elfmeterschießen (1982, 1986, 1990, 2006).",
  "Die Fußball-WM ist das weltweit wichtigste Turnier für Nationalmannschaften. Die WM 1954 hatte mit 5,38 Toren pro Spiel den höchsten Torschnitt aller Zeiten.",
  "Die WM 1990 hatte mit 2,21 Toren pro Spiel den niedrigsten Torschnitt.",
  "Mexiko war 1986 das erste Land mit zwei WM-Ausrichtungen.",
  "Die WM 1954 in der Schweiz war die erste live im Fernsehen übertragene Weltmeisterschaft.",
  "Viele Experten bezeichnen Brasiliens WM-Team von 1970 als die beste Nationalmannschaft aller Zeiten.",
  "Mario Götze erzielte das entscheidende Siegtor im Finale der WM 2014 in der 113. Minute.",
  "Geoff Hurst erzielte 1966 den einzigen Hattrick in einem WM-Finale.",
  "Cristiano Ronaldo traf bei den WMs 2006, 2010, 2014, 2018 und 2022.",
  "Lionel Messi traf bei den WMs 2006, 2014, 2018 und 2022 sowie in Katar mehrfach.",
  "Lothar Matthäus hält mit 25 Einsätzen lange den WM-Rekord. Lothar Matthäus absolvierte zwischen 1982 und 1998 insgesamt 25 WM-Spiele und ist Rekordspieler bei Weltmeisterschaften.",
  "Antonio Carbajal war der erste Spieler, der an fünf Weltmeisterschaften teilnahm (1950–1966).",
  "Rafael Márquez spielte ebenfalls bei fünf Weltmeisterschaften (2002–2018).",
  "Gianluigi Buffon war 2006 Kapitän der italienischen Weltmeistermannschaft.",
  "Die WM 1998 in Frankreich war die erste mit 32 teilnehmenden Mannschaften.",
  "Die WM 1982 in Spanien war die erste mit 24 Teams im Endturnier.",
  "Die WM 1938 in Frankreich war die letzte WM vor dem Zweiten Weltkrieg.",
  "Brasilien gewann 1958 in Schweden erstmals den WM-Titel außerhalb Südamerikas.",
  "Frankreich gewann die WM 2018 in Russland und blieb im Turnier ohne Niederlage in der regulären Spielzeit der K.-o.-Phase.",
  "Deutschland verlor bei der WM 2010 erstmals gegen Serbien in der Gruppenphase.",
  "Ungarn erzielte bei der WM 1954 insgesamt 27 Tore in nur fünf Spielen.",
  "Bei der WM 1958 erzielte Pelé im Finale gegen Schweden zwei Tore im Alter von 17 Jahren.",
  "Vavá erzielte bei den WMs 1958 und 1962 jeweils im Finale ein Tor für Brasilien.",
  "Pelé gewann seine drei WM-Titel 1958, 1962 und 1970 mit drei verschiedenen Turniergenerationen Brasiliens.",
  "Zinédine Zidane wurde 1998 und 2006 WM-Finaltorschütze für Frankreich.",
  "Cafu ist der einzige Spieler, der in drei aufeinanderfolgenden WM-Endspielen stand (1994, 1998, 2002).",
  "Brasilien erreichte insgesamt sieben WM-Endspiele (bis 2022).",
  "Deutschland erreichte häufiger das Halbfinale als jede andere Nation im Weltfußball.",
  "Argentinien stand insgesamt sechs Mal im WM-Finale (bis 2022).",
  "Italien gewann 2006 alle K.-o.-Spiele nach regulärer Spielzeit oder Elfmeterschießen ohne Niederlage.",
  "Das erste WM-Eigentor der Geschichte fiel bei der WM 1938 durch einen Brasilianer gegen Polen.",
  "Die rote Karte wurde erstmals bei der WM 1970 offiziell eingeführt.",
  "Gelbe Karten wurden ebenfalls 1970 erstmals bei einer WM verwendet.",
  "Der Video-Schiedsrichter (VAR) wurde erstmals bei der WM 2018 in Russland eingesetzt.",
  "Die Torlinientechnologie wurde erstmals bei der WM 2014 in Brasilien verwendet.",
  "Brasilien erreichte als erstes Land 100 WM-Siege (insgesamt über alle Turniere hinweg).",
  "Deutschland gewann 2014 als erstes europäisches Team eine WM in Südamerika.",
  "Argentinien verlor drei WM-Finals gegen europäische Gegner (1990, 2014, 2022).",
  "Frankreich gewann seine ersten beiden WM-Finals (1998 und 2018).",
  "Spanien kassierte bei der WM 2010 insgesamt nur zwei Gegentore im gesamten Turnier.",
  "Die WM 2002 in Südkorea und Japan war die erste, die in Asien stattfand.",
  "Die WM 2002 war die erste, die von zwei Ländern gemeinsam ausgerichtet wurde.",
  "Die WM 2026 wird erstmals in drei Ländern (USA, Kanada, Mexiko) stattfinden.",
  "Roger Milla erzielte bei der WM 1994 ein Tor im Alter von 42 Jahren und wurde damit ältester WM-Torschütze.",
  "Norman Whiteside aus Nordirland ist der jüngste Spieler, der jemals bei einer WM eingesetzt wurde (1982, 17 Jahre).",
  "Samuel Eto’o nahm zwischen 1998 und 2014 an vier Weltmeisterschaften teil.",
  "Diego Maradona absolvierte bei Weltmeisterschaften insgesamt 21 Spiele für Argentinien.",
  "Deutschland gewann bei der WM 2014 sieben Spiele in Folge und wurde Weltmeister ohne Niederlage nach regulärer Spielzeit.",
  "Kein amtierender Weltmeister konnte seinen Titel seit Brasilien 1962 erfolgreich verteidigen.",
  "Die Fußball-Weltmeisterschaft ist das meistgesehene Sportereignis der Welt und wird in über 200 Ländern übertragen."
];

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

function sortiereNachAnpfiff<T extends { anpfiff: string }>(spiele: T[]) {
  return [...spiele].sort((erstes, zweites) => new Date(erstes.anpfiff).getTime() - new Date(zweites.anpfiff).getTime());
}

export function StartseitenUebersicht() {
  const [ansicht, setAnsicht] = useState<StartseitenAnsicht>("heute");
  const [datum, setDatum] = useState(() => new Date().toISOString().slice(0, 10));
  const { spiele, istLadend, fehler } = useSpiele({ bereich: "alle" });
  const fussballfakt = fussballFakten[new Date().getDate() % fussballFakten.length];

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

    return sortierteSpiele.slice(0, 4);
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
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/70">Fußballfakt des Tages</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">{fussballfakt}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
          Unterhalb kannst du zwischen Favoriten, Heute und Nächste Spiele wählen.
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