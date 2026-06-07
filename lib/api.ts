import { cache } from "react";
import type { Gruppe, Spiel, Spielstatus } from "@/lib/types";

const BASIS_URL = "https://api.football-data.org/v4";
const WETTBEWERBS_CODE = "WC";

type ApiMannschaft = {
  id: number;
  name: string;
  tla?: string;
  shortName?: string;
  crest?: string;
  area?: {
    id?: number;
    name?: string;
    code?: string;
    flag?: string;
  };
};

type ApiSpiel = {
  id: number;
  utcDate: string;
  status: Spielstatus;
  matchday?: number;
  venue?: string;
  group?: string;
  stage?: string;
  homeTeam: ApiMannschaft;
  awayTeam: ApiMannschaft;
  score?: {
    fullTime?: { home?: number | null; away?: number | null };
    halfTime?: { home?: number | null; away?: number | null };
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

const KENNZAHLEN_FUER_FLAGGE: Record<string, string> = {
  deutschland: "🇩🇪",
  germany: "🇩🇪",
  osterreich: "🇦🇹",
  oesterreich: "🇦🇹",
  austria: "🇦🇹"
};

function baueHeader(): Headers {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) {
    throw new Error("FOOTBALL_DATA_API_KEY ist nicht gesetzt.");
  }

  return new Headers({
    "X-Auth-Token": token
  });
}

async function ladeJson<T>(pfad: string): Promise<T> {
  const antwort = await fetch(`${BASIS_URL}${pfad}`, {
    headers: baueHeader(),
    cache: "no-store"
  });

  if (!antwort.ok) {
    throw new Error(`football-data.org meldet ${antwort.status}`);
  }

  return (await antwort.json()) as T;
}

function normalizeText(text: string | null | undefined): string {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function flaggeAusName(name: string): string {
  return KENNZAHLEN_FUER_FLAGGE[normalizeText(name)] ?? "🏳️";
}

function teamZuMannschaft(team: ApiMannschaft): { id: number; name: string; kuerzel?: string; flagge: string } {
  const flagge = team.area?.flag && team.area.flag.length > 0 ? team.area.flag : flaggeAusName(team.area?.name ?? team.name);

  return {
    id: team.id,
    name: team.shortName ?? team.name,
    kuerzel: team.tla,
    flagge
  };
}

function matchZuSpiel(match: ApiSpiel): Spiel {
  const gruppe = match.group ?? match.stage ?? "Gruppenphase";
  const heimTore = match.score?.fullTime?.home ?? undefined;
  const gastTore = match.score?.fullTime?.away ?? undefined;

  return {
    id: match.id,
    heimTeam: teamZuMannschaft(match.homeTeam),
    gastTeam: teamZuMannschaft(match.awayTeam),
    anpfiff: match.utcDate,
    status: match.status,
    heimTore: heimTore === null ? undefined : heimTore,
    gastTore: gastTore === null ? undefined : gastTore,
    minute: match.minute,
    stadion: match.venue ?? "Unbekanntes Stadion",
    gruppe
  };
}

function istHeutigesDatum(datumA: Date, datumB: Date): boolean {
  return datumA.toDateString() === datumB.toDateString();
}

function istDeutschland(teamName: string): boolean {
  const normalisiert = normalizeText(teamName);
  return normalisiert.includes("germany") || normalisiert.includes("deutschland") || normalisiert.includes("deu");
}

function istOesterreich(teamName: string): boolean {
  const normalisiert = normalizeText(teamName);
  return normalisiert.includes("austria") || normalisiert.includes("osterreich") || normalisiert.includes("oesterreich") || normalisiert.includes("aut");
}

function istFavoritSpiel(spiel: Spiel): boolean {
  return istDeutschland(spiel.heimTeam.name) || istDeutschland(spiel.gastTeam.name) || istOesterreich(spiel.heimTeam.name) || istOesterreich(spiel.gastTeam.name);
}

function sortiereFavoritenZuerst(spiele: Spiel[]): Spiel[] {
  return [...spiele].sort((erstes, zweites) => {
    const erstesFavorit = istFavoritSpiel(erstes) ? 0 : 1;
    const zweitesFavorit = istFavoritSpiel(zweites) ? 0 : 1;
    if (erstesFavorit !== zweitesFavorit) {
      return erstesFavorit - zweitesFavorit;
    }
    return new Date(erstes.anpfiff).getTime() - new Date(zweites.anpfiff).getTime();
  });
}

export const ladeAlleSpiele = cache(async (): Promise<Spiel[]> => {
  const daten = await ladeJson<{ matches: ApiSpiel[] }>(`/competitions/${WETTBEWERBS_CODE}/matches`);
  return daten.matches.map(matchZuSpiel).sort((a, b) => new Date(a.anpfiff).getTime() - new Date(b.anpfiff).getTime());
});

export const ladeStandings = cache(async (): Promise<Gruppe[]> => {
  const daten = await ladeJson<ApiStandingsAntwort>(`/competitions/${WETTBEWERBS_CODE}/standings`);
  return (daten.standings ?? []).map((gruppe) => ({
    name: gruppe.group ?? "Gruppe",
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
});

export async function ladeSpieleMitFilter(bereich: string, filter?: string): Promise<Spiel[]> {
  const alleSpiele = await ladeAlleSpiele();
  const jetzt = new Date();

  let gefilterteSpiele = alleSpiele;

  if (bereich === "heute") {
    gefilterteSpiele = alleSpiele.filter((spiel) => istHeutigesDatum(new Date(spiel.anpfiff), jetzt));
  } else if (bereich === "naechste") {
    gefilterteSpiele = alleSpiele.filter((spiel) => new Date(spiel.anpfiff).getTime() >= jetzt.getTime()).slice(0, 6);
  } else if (bereich === "live") {
    gefilterteSpiele = alleSpiele.filter((spiel) => spiel.status === "IN_PLAY" || spiel.status === "PAUSED");
  } else if (bereich === "favoriten") {
    gefilterteSpiele = alleSpiele.filter(istFavoritSpiel);
  }

  if (filter === "deutschland") {
    gefilterteSpiele = gefilterteSpiele.filter((spiel) => istDeutschland(spiel.heimTeam.name) || istDeutschland(spiel.gastTeam.name));
  }

  if (filter === "oesterreich") {
    gefilterteSpiele = gefilterteSpiele.filter((spiel) => istOesterreich(spiel.heimTeam.name) || istOesterreich(spiel.gastTeam.name));
  }

  if (filter === "favoriten") {
    gefilterteSpiele = sortiereFavoritenZuerst(gefilterteSpiele);
  }

  return gefilterteSpiele;
}

export async function ladeSpielNachId(spielId: number): Promise<Spiel | undefined> {
  const alleSpiele = await ladeAlleSpiele();
  return alleSpiele.find((spiel) => spiel.id === spielId);
}

export function gruppiereNachTag(spiele: Spiel[]): Array<{ tag: string; spiele: Spiel[] }> {
  const formatter = new Intl.DateTimeFormat("de-AT", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Vienna"
  });

  const gruppen = new Map<string, Spiel[]>();

  for (const spiel of spiele) {
    const schluessel = new Date(spiel.anpfiff).toDateString();
    const vorhandene = gruppen.get(schluessel) ?? [];
    vorhandene.push(spiel);
    gruppen.set(schluessel, vorhandene);
  }

  return [...gruppen.entries()]
    .sort(([erstes], [zweites]) => new Date(erstes).getTime() - new Date(zweites).getTime())
    .map(([schluessel, eintraege]) => ({
      tag: formatter.format(new Date(schluessel)),
      spiele: eintraege.sort((a, b) => new Date(a.anpfiff).getTime() - new Date(b.anpfiff).getTime())
    }));
}

export function formatiereZeit(stichtag: string | Date): string {
  return new Intl.DateTimeFormat("de-AT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Vienna"
  }).format(new Date(stichtag));
}

export function formatiereDatum(stichtag: string | Date): string {
  return new Intl.DateTimeFormat("de-AT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Vienna"
  }).format(new Date(stichtag));
}

export function formatiereLiveStatus(status: Spielstatus, minute?: number): string {
  if (status === "IN_PLAY") {
    return minute ? `${minute}. Minute` : "LIVE";
  }

  if (status === "PAUSED") {
    return "Pause";
  }

  if (status === "FINISHED") {
    return "Beendet";
  }

  return "Anpfiff geplant";
}

export function erzeugeIcsDate(datum: Date): string {
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
