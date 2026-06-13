export type Spielstatus = "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "CANCELLED";

export interface Mannschaft {
  id: number;
  name: string;
  kuerzel?: string;
  flagge?: string;
}

export interface Spiel {
  id: number;
  heimTeam: Mannschaft;
  gastTeam: Mannschaft;
  anpfiff: string;
  status: Spielstatus;
  heimTore?: number;
  gastTore?: number;
  minute?: number;
  stadion: string;
  gruppe: string;
  phase?: string;
  spielNummer?: number;
  istKoSpiel?: boolean;
  istFixiert?: boolean;
}

export interface TabellenZeile {
  platz: number;
  team: Mannschaft;
  spiele: number;
  siege: number;
  unentschieden: number;
  niederlagen: number;
  toreFuer: number;
  toreGegen: number;
  tordifferenz: number;
  punkte: number;
}

export interface Gruppe {
  name: string;
  zeilen: TabellenZeile[];
}

export interface ApiAntwort<T> {
  daten: T;
  zuletztAktualisiert: string;
}
