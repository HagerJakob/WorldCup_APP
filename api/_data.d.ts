import type { Gruppe, Spiel } from "../src/types";

export function ladeSpieleMitFilter(bereich: string, filter?: string): Promise<Spiel[]>;
export function ladeStandings(): Promise<Gruppe[]>;
export function ladeSpielNachId(spielId: number): Promise<Spiel | undefined>;
export function baueIcsInhalt(spiel: Spiel): string;
