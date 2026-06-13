import type { Gruppe, Mannschaft, Spiel, Spielstatus, TabellenZeile } from "../src/types";

const BASIS_URL = "https://api.football-data.org/v4";
const WETTBEWERBS_CODE = "WC";

type ApiMannschaft = {
  id: number;
  name: string;
  tla?: string;
  shortName?: string;
  crest?: string;
};

type ApiSpiel = {
  id: number;
  utcDate: string;
  status: Spielstatus;
  venue?: string;
  group?: string;
  stage?: string;
  matchday?: number;
  homeTeam: ApiMannschaft;
  awayTeam: ApiMannschaft;
  score?: {
    fullTime?: { home?: number | null; away?: number | null };
  };
  minute?: number;
};

type ApiStandingsAntwort = {
  standings?: Array<{
    group?: string;
    table?: Array<{
      position: number;
      team: ApiMannschaft;
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
      points: number;
    }>;
  }>;
};

const FLAGGEN_CODE_PRO_TEAM: Record<string, string> = {
  algeria: "dz",
  argentina: "ar",
  australia: "au",
  austria: "at",
  belgium: "be",
  bosniah: "ba",
  brazil: "br",
  canada: "ca",
  capeverde: "cv",
  colombia: "co",
  congodr: "cd",
  croatia: "hr",
  curacao: "cw",
  czechia: "cz",
  ecuador: "ec",
  egypt: "eg",
  england: "gb-eng",
  france: "fr",
  germany: "de",
  ghana: "gh",
  haiti: "ht",
  iran: "ir",
  iraq: "iq",
  ivorycoast: "ci",
  japan: "jp",
  jordan: "jo",
  korearepublic: "kr",
  mexico: "mx",
  morocco: "ma",
  netherlands: "nl",
  newzealand: "nz",
  norway: "no",
  panama: "pa",
  paraguay: "py",
  portugal: "pt",
  qatar: "qa",
  saudiarabia: "sa",
  scotland: "gb-sct",
  senegal: "sn",
  southafrica: "za",
  spain: "es",
  sweden: "se",
  switzerland: "ch",
  tunisia: "tn",
  turkey: "tr",
  uruguay: "uy",
  usa: "us",
  uzbekistan: "uz"
};

const TEAMNAME_AUF_DEUTSCH: Record<string, string> = {
  algeria: "Algerien",
  argentina: "Argentinien",
  australia: "Australien",
  austria: "Österreich",
  belgium: "Belgien",
  bosniah: "Bosnien-Herzegowina",
  brazil: "Brasilien",
  canada: "Kanada",
  capeverde: "Kap Verde",
  colombia: "Kolumbien",
  congodr: "DR Kongo",
  croatia: "Kroatien",
  curacao: "Curaçao",
  czechia: "Tschechien",
  ecuador: "Ecuador",
  egypt: "Ägypten",
  england: "England",
  france: "Frankreich",
  germany: "Deutschland",
  ghana: "Ghana",
  haiti: "Haiti",
  iran: "Iran",
  iraq: "Irak",
  ivorycoast: "Elfenbeinküste",
  japan: "Japan",
  jordan: "Jordanien",
  korearepublic: "Südkorea",
  mexico: "Mexiko",
  morocco: "Marokko",
  netherlands: "Niederlande",
  newzealand: "Neuseeland",
  norway: "Norwegen",
  panama: "Panama",
  paraguay: "Paraguay",
  portugal: "Portugal",
  qatar: "Katar",
  saudiarabia: "Saudi-Arabien",
  scotland: "Schottland",
  senegal: "Senegal",
  southafrica: "Südafrika",
  spain: "Spanien",
  sweden: "Schweden",
  switzerland: "Schweiz",
  tunisia: "Tunesien",
  turkey: "Türkei",
  uruguay: "Uruguay",
  usa: "USA",
  uzbekistan: "Usbekistan"
};

async function ladeJson<T>(pfad: string): Promise<T> {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) throw new Error("FOOTBALL_DATA_API_KEY ist nicht gesetzt.");

  const antwort = await fetch(`${BASIS_URL}${pfad}`, {
    headers: { "X-Auth-Token": token }
  });

  if (!antwort.ok) throw new Error(`football-data.org meldet ${antwort.status}`);
  return (await antwort.json()) as T;
}

function normalizeText(text: string | null | undefined): string {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function normalisiereTeamSchluessel(name: string | null | undefined): string {
  return normalizeText(name).replace(/[^a-z0-9]+/g, "");
}

function teamZuMannschaft(team: ApiMannschaft) {
  const name = team.shortName ?? team.name;
  const schluessel = normalisiereTeamSchluessel(name);
  const isoCode = FLAGGEN_CODE_PRO_TEAM[schluessel];

  return {
    id: team.id,
    name: TEAMNAME_AUF_DEUTSCH[schluessel] ?? String(name ?? "Unbekannt"),
    kuerzel: team.tla,
    flagge: isoCode ? `https://flagcdn.com/w80/${isoCode}.png` : team.crest ?? "🏳️"
  };
}

function istGruppenPhase(stage: string | undefined, gruppe: string | undefined): boolean {
  return Boolean(gruppe) || /GROUP/i.test(stage ?? "");
}

function formatiereAbschnittName(abschnitt: string | undefined): string {
  if (!abschnitt) return "Gruppenphase";

  const normalisiert = abschnitt.trim().toUpperCase();
  const gruppe = normalisiert.match(/^GROUP[_\s-]?([A-L])$/);
  if (gruppe) return `Gruppe ${gruppe[1]}`;

  if (normalisiert.includes("LAST_32") || normalisiert.includes("ROUND_OF_32")) return "Sechzehntelfinale";
  if (normalisiert.includes("LAST_16") || normalisiert.includes("ROUND_OF_16")) return "Achtelfinale";
  if (normalisiert.includes("QUARTER")) return "Viertelfinale";
  if (normalisiert.includes("SEMI")) return "Halbfinale";
  if (normalisiert.includes("THIRD") || normalisiert.includes("BRONZE")) return "Spiel um Platz 3";
  if (normalisiert.includes("FINAL")) return "Finale";
  if (normalisiert.includes("GROUP")) return "Gruppenphase";

  return abschnitt
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w|\s\w/g, (zeichen) => zeichen.toUpperCase());
}

function istEchteMannschaft(team: Mannschaft): boolean {
  const name = normalisiereTeamSchluessel(team.name);
  return team.id > 0 && Boolean(name) && !["unbekannt", "unknown", "tbd", "tobedecided", "nnb", "nn"].includes(name);
}

function istSichtbaresSpiel(spiel: Spiel): boolean {
  return !spiel.istKoSpiel || Boolean(spiel.istFixiert);
}

function matchZuSpiel(match: ApiSpiel): Spiel {
  const heimTore = match.score?.fullTime?.home ?? undefined;
  const gastTore = match.score?.fullTime?.away ?? undefined;
  const heimTeam = teamZuMannschaft(match.homeTeam);
  const gastTeam = teamZuMannschaft(match.awayTeam);
  const istKoSpiel = Boolean(match.stage) && !istGruppenPhase(match.stage, match.group);
  const istFixiert = istEchteMannschaft(heimTeam) && istEchteMannschaft(gastTeam);

  return {
    id: match.id,
    heimTeam,
    gastTeam,
    anpfiff: match.utcDate,
    status: match.status,
    heimTore: heimTore === null ? undefined : heimTore,
    gastTore: gastTore === null ? undefined : gastTore,
    minute: match.minute,
    stadion: match.venue ?? "",
    gruppe: formatiereAbschnittName(match.group ?? match.stage),
    phase: match.stage,
    spielNummer: match.matchday,
    istKoSpiel,
    istFixiert
  };
}

function istHeutigesDatum(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

let spieleCache: { zeit: number; daten: Spiel[] } | undefined;
let standingsCache: { zeit: number; daten: Gruppe[] } | undefined;
const CACHE_MS = 60_000;

export async function ladeAlleSpiele(): Promise<Spiel[]> {
  if (spieleCache && Date.now() - spieleCache.zeit < CACHE_MS) return spieleCache.daten;
  const daten = await ladeJson<{ matches: ApiSpiel[] }>(`/competitions/${WETTBEWERBS_CODE}/matches`);
  const spiele = daten.matches.map(matchZuSpiel).sort((a, b) => new Date(a.anpfiff).getTime() - new Date(b.anpfiff).getTime());
  spieleCache = { zeit: Date.now(), daten: spiele };
  return spiele;
}

export async function ladeStandings(): Promise<Gruppe[]> {
  if (standingsCache && Date.now() - standingsCache.zeit < CACHE_MS) return standingsCache.daten;
  const daten = await ladeJson<ApiStandingsAntwort>(`/competitions/${WETTBEWERBS_CODE}/standings`);
  const standingsGruppen = (daten.standings ?? []).map((gruppe) => ({
    name: formatiereAbschnittName(gruppe.group),
    zeilen: (gruppe.table ?? []).map((zeile) => ({
      platz: zeile.position,
      team: teamZuMannschaft(zeile.team),
      spiele: zeile.playedGames,
      siege: zeile.won,
      unentschieden: zeile.draw,
      niederlagen: zeile.lost,
      toreFuer: zeile.goalsFor,
      toreGegen: zeile.goalsAgainst,
      tordifferenz: zeile.goalDifference,
      punkte: zeile.points
    }))
  }));
  const gruppen = vervollstaendigeGruppen(standingsGruppen, await ladeGruppenAusSpielplan());
  standingsCache = { zeit: Date.now(), daten: gruppen };
  return gruppen;
}

async function ladeGruppenAusSpielplan(): Promise<Map<string, Mannschaft[]>> {
  const spiele = await ladeAlleSpiele();
  const gruppen = new Map<string, Map<number, Mannschaft>>();

  for (const spiel of spiele) {
    if (spiel.istKoSpiel || !istEchteMannschaft(spiel.heimTeam) || !istEchteMannschaft(spiel.gastTeam)) continue;
    const gruppe = gruppen.get(spiel.gruppe) ?? new Map<number, Mannschaft>();
    gruppe.set(spiel.heimTeam.id, spiel.heimTeam);
    gruppe.set(spiel.gastTeam.id, spiel.gastTeam);
    gruppen.set(spiel.gruppe, gruppe);
  }

  return new Map([...gruppen.entries()].map(([name, teams]) => [name, [...teams.values()]]));
}

function leereTabellenZeile(team: Mannschaft, platz: number): TabellenZeile {
  return {
    platz,
    team,
    spiele: 0,
    siege: 0,
    unentschieden: 0,
    niederlagen: 0,
    toreFuer: 0,
    toreGegen: 0,
    tordifferenz: 0,
    punkte: 0
  };
}

function vervollstaendigeGruppen(standingsGruppen: Gruppe[], spielplanGruppen: Map<string, Mannschaft[]>): Gruppe[] {
  const gruppen = new Map<string, Gruppe>();

  for (const gruppe of standingsGruppen) {
    gruppen.set(gruppe.name, { ...gruppe, zeilen: [...gruppe.zeilen] });
  }

  for (const [gruppenName, teams] of spielplanGruppen) {
    const gruppe = gruppen.get(gruppenName) ?? { name: gruppenName, zeilen: [] };
    const vorhandeneTeamIds = new Set(gruppe.zeilen.map((zeile) => zeile.team.id));
    const fehlendeTeams = teams.filter((team) => !vorhandeneTeamIds.has(team.id));
    const startPlatz = gruppe.zeilen.length + 1;

    gruppen.set(gruppenName, {
      name: gruppe.name,
      zeilen: [...gruppe.zeilen, ...fehlendeTeams.map((team, index) => leereTabellenZeile(team, startPlatz + index))]
    });
  }

  return [...gruppen.values()];
}

export async function ladeSpieleMitFilter(bereich: string, filter?: string): Promise<Spiel[]> {
  const alleSpiele = await ladeAlleSpiele();
  const jetzt = new Date();
  const sichtbareSpiele = alleSpiele.filter(istSichtbaresSpiel);
  let gefilterteSpiele = sichtbareSpiele;

  if (bereich === "heute") gefilterteSpiele = sichtbareSpiele.filter((spiel) => istHeutigesDatum(new Date(spiel.anpfiff), jetzt));
  else if (bereich === "naechste") gefilterteSpiele = sichtbareSpiele.filter((spiel) => new Date(spiel.anpfiff).getTime() >= jetzt.getTime()).slice(0, 6);
  else if (bereich === "live") gefilterteSpiele = sichtbareSpiele.filter((spiel) => spiel.status === "IN_PLAY" || spiel.status === "PAUSED");
  else if (bereich === "favoriten") gefilterteSpiele = sichtbareSpiele.slice(0, 8);

  if (filter === "heute") gefilterteSpiele = gefilterteSpiele.filter((spiel) => istHeutigesDatum(new Date(spiel.anpfiff), jetzt));
  if (filter === "naechste") gefilterteSpiele = gefilterteSpiele.filter((spiel) => new Date(spiel.anpfiff).getTime() >= jetzt.getTime()).slice(0, 6);
  if (filter === "live") gefilterteSpiele = gefilterteSpiele.filter((spiel) => spiel.status === "IN_PLAY" || spiel.status === "PAUSED");
  if (filter === "favoriten") gefilterteSpiele = gefilterteSpiele.slice(0, 8);

  return gefilterteSpiele;
}

export async function ladeSpielNachId(spielId: number): Promise<Spiel | undefined> {
  const alleSpiele = await ladeAlleSpiele();
  return alleSpiele.find((spiel) => spiel.id === spielId);
}

function erzeugeIcsDate(datum: Date): string {
  return datum.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function baueIcsInhalt(spiel: Spiel): string {
  const start = new Date(spiel.anpfiff);
  const ende = new Date(start.getTime() + 120 * 60 * 1000);
  const titel = `${spiel.heimTeam.name} gegen ${spiel.gastTeam.name}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WM2026-App//DE",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${spiel.id}@wm2026-app`,
    `DTSTAMP:${erzeugeIcsDate(new Date())}`,
    `DTSTART:${erzeugeIcsDate(start)}`,
    `DTEND:${erzeugeIcsDate(ende)}`,
    `SUMMARY:${titel}`,
    `DESCRIPTION:${titel} in ${spiel.stadion}`,
    `LOCATION:${spiel.stadion}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
