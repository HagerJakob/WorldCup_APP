import { FIFA_DRITTPLATZ_ZUORDNUNG_CSV, GRUPPENSIEGER_MIT_DRITTPLATZIERTEM } from "../data/drittplatzZuordnung";
import type { Gruppe, Mannschaft, Spiel, Spielstatus, TabellenZeile } from "../types";

export type GruppenBuchstabe = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
type Platz = 1 | 2 | 3;

export type KoTeilnehmer = {
  typ: "team" | "platzhalter" | "sieger" | "verlierer";
  label: string;
  team?: Mannschaft;
  gruppe?: GruppenBuchstabe;
  platz?: Platz;
  referenzMatch?: number;
};

export type KoSpiel = {
  nummer: number;
  runde: "Sechzehntelfinale" | "Achtelfinale" | "Viertelfinale" | "Halbfinale" | "Spiel um Platz 3" | "Finale";
  teamA: KoTeilnehmer;
  teamB: KoTeilnehmer;
  datum?: string;
  ort?: string;
  apiSpiel?: Spiel;
  status?: Spielstatus;
  heimTore?: number;
  gastTore?: number;
  istFixiert?: boolean;
};

export type Gruppendritter = TabellenZeile & {
  gruppe: GruppenBuchstabe;
  fairplayPunkte: number;
  losentscheidRang: number;
};

export type Turnierbaum = {
  besteDritte: Gruppendritter[];
  drittplatzSchluessel: string;
  drittplatzZuordnung: Record<(typeof GRUPPENSIEGER_MIT_DRITTPLATZIERTEM)[number], GruppenBuchstabe>;
  spiele: KoSpiel[];
};

const GRUPPEN: GruppenBuchstabe[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const RUNDEN_DATEN: Record<number, Pick<KoSpiel, "datum" | "ort">> = {
  73: { datum: "28.06.", ort: "Los Angeles" },
  74: { datum: "29.06.", ort: "Boston" },
  75: { datum: "29.06.", ort: "Monterrey" },
  76: { datum: "29.06.", ort: "Houston" },
  77: { datum: "30.06.", ort: "New York/New Jersey" },
  78: { datum: "30.06.", ort: "Dallas" },
  79: { datum: "30.06.", ort: "Mexiko-Stadt" },
  80: { datum: "01.07.", ort: "Atlanta" },
  81: { datum: "01.07.", ort: "Seattle" },
  82: { datum: "01.07.", ort: "Miami" },
  83: { datum: "02.07.", ort: "Toronto" },
  84: { datum: "02.07.", ort: "Los Angeles" },
  85: { datum: "03.07.", ort: "Vancouver" },
  86: { datum: "03.07.", ort: "Atlanta" },
  87: { datum: "03.07.", ort: "Kansas City" },
  88: { datum: "03.07.", ort: "Dallas" },
  89: { datum: "04.07.", ort: "Philadelphia" },
  90: { datum: "04.07.", ort: "Houston" },
  91: { datum: "05.07.", ort: "New York/New Jersey" },
  92: { datum: "05.07.", ort: "Mexiko-Stadt" },
  93: { datum: "06.07.", ort: "Dallas" },
  94: { datum: "06.07.", ort: "Seattle" },
  95: { datum: "07.07.", ort: "Atlanta" },
  96: { datum: "07.07.", ort: "Vancouver" },
  97: { datum: "09.07.", ort: "Boston" },
  98: { datum: "10.07.", ort: "Los Angeles" },
  99: { datum: "11.07.", ort: "Miami" },
  100: { datum: "11.07.", ort: "Kansas City" },
  101: { datum: "14.07.", ort: "Dallas" },
  102: { datum: "15.07.", ort: "Atlanta" },
  103: { datum: "18.07.", ort: "Miami" },
  104: { datum: "19.07.", ort: "New York/New Jersey" }
};

export const DRITTPLATZ_LOOKUP = Object.fromEntries(
  FIFA_DRITTPLATZ_ZUORDNUNG_CSV.trim()
    .split("\n")
    .map((zeile) => {
      const [schluessel, zuordnung] = zeile.split(",");
      return [schluessel, zuordnung];
    })
) as Record<string, string>;

function gruppenBuchstabeAusName(name: string): GruppenBuchstabe | undefined {
  const treffer = name.toUpperCase().match(/[A-L]\b|GROUP_([A-L])|GRUPPE\s*([A-L])/);
  const buchstabe = treffer?.[1] ?? treffer?.[2] ?? treffer?.[0];
  return GRUPPEN.includes(buchstabe as GruppenBuchstabe) ? (buchstabe as GruppenBuchstabe) : undefined;
}

function findeGruppe(gruppen: Gruppe[], buchstabe: GruppenBuchstabe) {
  return gruppen.find((gruppe) => gruppenBuchstabeAusName(gruppe.name) === buchstabe);
}

function tabellenZeile(gruppen: Gruppe[], buchstabe: GruppenBuchstabe, platz: Platz) {
  return findeGruppe(gruppen, buchstabe)?.zeilen.find((zeile) => zeile.platz === platz) ?? findeGruppe(gruppen, buchstabe)?.zeilen[platz - 1];
}

function teilnehmerAusTabelle(gruppen: Gruppe[], buchstabe: GruppenBuchstabe, platz: Platz): KoTeilnehmer {
  const zeile = tabellenZeile(gruppen, buchstabe, platz);
  const platzText = platz === 1 ? "1." : platz === 2 ? "2." : "3.";

  if (!zeile) {
    return {
      typ: "platzhalter",
      label: `${platzText} Gruppe ${buchstabe}`,
      gruppe: buchstabe,
      platz
    };
  }

  return {
    typ: "team",
    label: zeile.team.name,
    team: zeile.team,
    gruppe: buchstabe,
    platz
  };
}

function sieger(match: number): KoTeilnehmer {
  return { typ: "sieger", label: `Sieger Match ${match}`, referenzMatch: match };
}

function verlierer(match: number): KoTeilnehmer {
  return { typ: "verlierer", label: `Verlierer Match ${match}`, referenzMatch: match };
}

function spiel(nummer: number, runde: KoSpiel["runde"], teamA: KoTeilnehmer, teamB: KoTeilnehmer): KoSpiel {
  return {
    nummer,
    runde,
    teamA,
    teamB,
    ...RUNDEN_DATEN[nummer]
  };
}

function rundeAusMatchNummer(nummer: number): KoSpiel["runde"] | undefined {
  if (nummer >= 73 && nummer <= 88) return "Sechzehntelfinale";
  if (nummer >= 89 && nummer <= 96) return "Achtelfinale";
  if (nummer >= 97 && nummer <= 100) return "Viertelfinale";
  if (nummer >= 101 && nummer <= 102) return "Halbfinale";
  if (nummer === 103) return "Spiel um Platz 3";
  if (nummer === 104) return "Finale";
  return undefined;
}

function rundeAusPhase(phase: string | undefined): KoSpiel["runde"] | undefined {
  const normalisiert = (phase ?? "").toUpperCase();
  if (normalisiert.includes("LAST_32") || normalisiert.includes("ROUND_OF_32")) return "Sechzehntelfinale";
  if (normalisiert.includes("LAST_16") || normalisiert.includes("ROUND_OF_16")) return "Achtelfinale";
  if (normalisiert.includes("QUARTER")) return "Viertelfinale";
  if (normalisiert.includes("SEMI")) return "Halbfinale";
  if (normalisiert.includes("THIRD") || normalisiert.includes("BRONZE")) return "Spiel um Platz 3";
  if (normalisiert.includes("FINAL")) return "Finale";
  return undefined;
}

function teamTeilnehmerAusApi(team: Mannschaft): KoTeilnehmer {
  return {
    typ: "team",
    label: team.name,
    team
  };
}

function formatiereApiDatum(anpfiff: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Vienna"
  }).format(new Date(anpfiff));
}

function enthaeltGleicheTeams(koSpiel: KoSpiel, apiSpiel: Spiel): boolean {
  const teamIds = [koSpiel.teamA.team?.id, koSpiel.teamB.team?.id].filter(Boolean).sort().join("-");
  const apiTeamIds = [apiSpiel.heimTeam.id, apiSpiel.gastTeam.id].filter(Boolean).sort().join("-");
  return Boolean(teamIds) && teamIds === apiTeamIds;
}

function uebernehmeApiSpiel(koSpiel: KoSpiel, apiSpiel: Spiel): KoSpiel {
  return {
    ...koSpiel,
    teamA: teamTeilnehmerAusApi(apiSpiel.heimTeam),
    teamB: teamTeilnehmerAusApi(apiSpiel.gastTeam),
    datum: formatiereApiDatum(apiSpiel.anpfiff),
    ort: apiSpiel.stadion || koSpiel.ort,
    apiSpiel,
    status: apiSpiel.status,
    heimTore: apiSpiel.heimTore,
    gastTore: apiSpiel.gastTore,
    istFixiert: true
  };
}

function ordneApiKoSpieleZu(spiele: KoSpiel[], apiSpiele: Spiel[]) {
  const zuordnung = new Map<number, Spiel>();
  const bereitsVerwendeteApiIds = new Set<number>();
  const fixeApiKoSpiele = apiSpiele
    .filter((spiel) => spiel.istKoSpiel && spiel.istFixiert)
    .sort((a, b) => new Date(a.anpfiff).getTime() - new Date(b.anpfiff).getTime());

  for (const apiSpiel of fixeApiKoSpiele) {
    if (apiSpiel.spielNummer && rundeAusMatchNummer(apiSpiel.spielNummer)) {
      zuordnung.set(apiSpiel.spielNummer, apiSpiel);
      bereitsVerwendeteApiIds.add(apiSpiel.id);
    }
  }

  for (const apiSpiel of fixeApiKoSpiele) {
    if (bereitsVerwendeteApiIds.has(apiSpiel.id)) continue;
    const passendesSpiel = spiele.find((koSpiel) => !zuordnung.has(koSpiel.nummer) && enthaeltGleicheTeams(koSpiel, apiSpiel));
    if (!passendesSpiel) continue;

    zuordnung.set(passendesSpiel.nummer, apiSpiel);
    bereitsVerwendeteApiIds.add(apiSpiel.id);
  }

  for (const apiSpiel of fixeApiKoSpiele) {
    if (bereitsVerwendeteApiIds.has(apiSpiel.id)) continue;
    const runde = rundeAusPhase(apiSpiel.phase);
    if (!runde) continue;

    const freiesSpielDerRunde = spiele.find((koSpiel) => koSpiel.runde === runde && !zuordnung.has(koSpiel.nummer));
    if (!freiesSpielDerRunde) continue;

    zuordnung.set(freiesSpielDerRunde.nummer, apiSpiel);
    bereitsVerwendeteApiIds.add(apiSpiel.id);
  }

  return zuordnung;
}

export function ermittleBesteGruppendritte(gruppen: Gruppe[]): Gruppendritter[] {
  return GRUPPEN.map((gruppe, index) => {
    const zeile = tabellenZeile(gruppen, gruppe, 3);
    if (!zeile) return undefined;

    return {
      ...zeile,
      gruppe,
      // Die football-data-API liefert aktuell keine Team-Conduct/Fairplay-Wertung.
      // Sobald diese Daten verfügbar sind, kann dieser Wert pro Tabellenzeile ersetzt werden.
      fairplayPunkte: 0,
      // FIFA nennt als letztes Kriterium Losentscheid. Für eine stabile Anzeige nutzen wir
      // bis zu echten Losdaten die Gruppenreihenfolge A-L als deterministischen Fallback.
      losentscheidRang: index
    };
  })
    .filter((zeile): zeile is Gruppendritter => Boolean(zeile))
    .sort(
      (a, b) =>
        b.punkte - a.punkte ||
        b.tordifferenz - a.tordifferenz ||
        b.toreFuer - a.toreFuer ||
        b.fairplayPunkte - a.fairplayPunkte ||
        a.losentscheidRang - b.losentscheidRang
    )
    .slice(0, 8);
}

export function erzeugeDrittplatzSchluessel(dritte: Array<Pick<Gruppendritter, "gruppe">>) {
  return dritte
    .map((dritter) => dritter.gruppe)
    .sort()
    .join("");
}

export function ermittleDrittplatzZuordnung(schluessel: string): Turnierbaum["drittplatzZuordnung"] {
  const zuordnung = DRITTPLATZ_LOOKUP[schluessel];
  if (!zuordnung) {
    throw new Error(`Keine FIFA-Zuordnung für Gruppendritten-Kombination ${schluessel} gefunden.`);
  }

  // FIFA-spezifisch: Die acht qualifizierten Drittplatzierten werden nicht frei ausgelost
  // und auch nicht nach ihrem Ranking Gegnern zugeteilt. Stattdessen wird aus den acht
  // Gruppenbuchstaben ein alphabetischer Schlüssel gebildet. Dieser Schlüssel verweist in
  // Annex C auf eine feste Reihenfolge für die Gruppensieger A, B, D, E, G, I, K und L.
  return Object.fromEntries(
    GRUPPENSIEGER_MIT_DRITTPLATZIERTEM.map((gruppensieger, index) => [gruppensieger, zuordnung[index] as GruppenBuchstabe])
  ) as Turnierbaum["drittplatzZuordnung"];
}

export function generiereTurnierbaum(gruppen: Gruppe[], apiSpiele: Spiel[] = []): Turnierbaum {
  const besteDritte = ermittleBesteGruppendritte(gruppen);
  const drittplatzSchluessel = erzeugeDrittplatzSchluessel(besteDritte);
  const drittplatzZuordnung = ermittleDrittplatzZuordnung(drittplatzSchluessel);
  const erster = (gruppe: GruppenBuchstabe) => teilnehmerAusTabelle(gruppen, gruppe, 1);
  const zweiter = (gruppe: GruppenBuchstabe) => teilnehmerAusTabelle(gruppen, gruppe, 2);
  const dritterGegen = (gruppensieger: keyof Turnierbaum["drittplatzZuordnung"]) => teilnehmerAusTabelle(gruppen, drittplatzZuordnung[gruppensieger], 3);

  const spiele: KoSpiel[] = [
    spiel(73, "Sechzehntelfinale", zweiter("A"), zweiter("B")),
    spiel(74, "Sechzehntelfinale", erster("E"), dritterGegen("E")),
    spiel(75, "Sechzehntelfinale", erster("F"), zweiter("C")),
    spiel(76, "Sechzehntelfinale", erster("C"), zweiter("F")),
    spiel(77, "Sechzehntelfinale", erster("I"), dritterGegen("I")),
    spiel(78, "Sechzehntelfinale", zweiter("E"), zweiter("I")),
    spiel(79, "Sechzehntelfinale", erster("A"), dritterGegen("A")),
    spiel(80, "Sechzehntelfinale", erster("L"), dritterGegen("L")),
    spiel(81, "Sechzehntelfinale", erster("D"), dritterGegen("D")),
    spiel(82, "Sechzehntelfinale", erster("G"), dritterGegen("G")),
    spiel(83, "Sechzehntelfinale", zweiter("K"), zweiter("L")),
    spiel(84, "Sechzehntelfinale", erster("H"), zweiter("J")),
    spiel(85, "Sechzehntelfinale", erster("B"), dritterGegen("B")),
    spiel(86, "Sechzehntelfinale", erster("J"), zweiter("H")),
    spiel(87, "Sechzehntelfinale", erster("K"), dritterGegen("K")),
    spiel(88, "Sechzehntelfinale", zweiter("D"), zweiter("G")),
    spiel(89, "Achtelfinale", sieger(73), sieger(75)),
    spiel(90, "Achtelfinale", sieger(74), sieger(77)),
    spiel(91, "Achtelfinale", sieger(76), sieger(78)),
    spiel(92, "Achtelfinale", sieger(79), sieger(80)),
    spiel(93, "Achtelfinale", sieger(83), sieger(84)),
    spiel(94, "Achtelfinale", sieger(81), sieger(82)),
    spiel(95, "Achtelfinale", sieger(86), sieger(88)),
    spiel(96, "Achtelfinale", sieger(85), sieger(87)),
    spiel(97, "Viertelfinale", sieger(89), sieger(90)),
    spiel(98, "Viertelfinale", sieger(93), sieger(94)),
    spiel(99, "Viertelfinale", sieger(91), sieger(92)),
    spiel(100, "Viertelfinale", sieger(95), sieger(96)),
    spiel(101, "Halbfinale", sieger(97), sieger(98)),
    spiel(102, "Halbfinale", sieger(99), sieger(100)),
    spiel(103, "Spiel um Platz 3", verlierer(101), verlierer(102)),
    spiel(104, "Finale", sieger(101), sieger(102))
  ];

  const apiKoZuordnung = ordneApiKoSpieleZu(spiele, apiSpiele);
  const spieleMitApiDaten = spiele.map((koSpiel) => {
    const apiSpiel = apiKoZuordnung.get(koSpiel.nummer);
    return apiSpiel ? uebernehmeApiSpiel(koSpiel, apiSpiel) : koSpiel;
  });

  return {
    besteDritte,
    drittplatzSchluessel,
    drittplatzZuordnung,
    spiele: spieleMitApiDaten
  };
}
