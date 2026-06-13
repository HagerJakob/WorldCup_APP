import type { Spiel, Spielstatus } from "./types";

export function formatiereZeit(stichtag: string | Date): string {
  return new Intl.DateTimeFormat("de-AT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Vienna"
  }).format(new Date(stichtag));
}

export function formatiereDatumZeit(stichtag: string | Date): string {
  return new Intl.DateTimeFormat("de-AT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Vienna"
  }).format(new Date(stichtag));
}

export function formatiereAbschnittName(abschnitt: string | undefined): string {
  if (!abschnitt) return "Gruppenphase";

  const normalisiert = abschnitt.trim().toUpperCase();
  const gruppenTreffer = normalisiert.match(/^GROUP[_\s-]?([A-L])$/);
  if (gruppenTreffer) return `Gruppe ${gruppenTreffer[1]}`;

  if (normalisiert.includes("LAST_32") || normalisiert.includes("ROUND_OF_32")) return "Sechzehntelfinale";
  if (normalisiert.includes("LAST_16") || normalisiert.includes("ROUND_OF_16")) return "Achtelfinale";
  if (normalisiert.includes("QUARTER")) return "Viertelfinale";
  if (normalisiert.includes("SEMI")) return "Halbfinale";
  if (normalisiert.includes("THIRD") || normalisiert.includes("BRONZE")) return "Spiel um Platz 3";
  if (normalisiert.includes("FINAL")) return "Finale";
  if (normalisiert.includes("GROUP")) return "Gruppenphase";

  return abschnitt;
}

export function formatiereLiveStatus(status: Spielstatus, minute?: number): string {
  if (status === "IN_PLAY") return minute ? `${minute}. Minute` : "LIVE";
  if (status === "PAUSED") return "Pause";
  if (status === "FINISHED") return "Beendet";
  if (status === "POSTPONED") return "Verschoben";
  if (status === "CANCELLED") return "Abgesagt";
  return "Anpfiff geplant";
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
    gruppen.set(schluessel, [...(gruppen.get(schluessel) ?? []), spiel]);
  }

  return [...gruppen.entries()]
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([schluessel, eintraege]) => ({
      tag: formatter.format(new Date(schluessel)),
      spiele: [...eintraege].sort((a, b) => new Date(a.anpfiff).getTime() - new Date(b.anpfiff).getTime())
    }));
}

export function tagInWien(zeitpunkt: string | Date) {
  return new Intl.DateTimeFormat("de-AT", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(zeitpunkt));
}
