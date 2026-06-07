export type Spielstatus = "SCHEDULED" | "IN_PLAY" | "FINISHED" | "PAUSED";

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

export interface Wettbewerb {
  id: number;
  code: string;
  name: string;
}

export interface ApiAntwort<T> {
  daten: T;
  zuletztAktualisiert: string;
}

export interface FehlerAntwort {
  nachricht: string;
}
