"use client";

import useSWR from "swr";
import type { Spiel } from "@/lib/types";

type Filter = "alle" | "heute" | "naechste" | "live" | "favoriten";

type Optionen = {
  bereich?: Filter;
  filter?: "alle" | "heute" | "naechste" | "live" | "favoriten";
  status?: string;
  teamId?: number;
};

async function ladeJson<T>(url: string): Promise<T> {
  const antwort = await fetch(url);
  if (!antwort.ok) {
    const fehler = (await antwort.json().catch(() => null)) as { nachricht?: string } | null;
    throw new Error(fehler?.nachricht ?? `Fehler beim Laden von ${url}`);
  }
  return (await antwort.json()) as T;
}

export function useSpiele(optionen: Optionen = {}) {
  const suchParameter = new URLSearchParams();

  if (optionen.bereich) {
    suchParameter.set("bereich", optionen.bereich);
  }

  if (optionen.filter) {
    suchParameter.set("filter", optionen.filter);
  }

  if (optionen.status) {
    suchParameter.set("status", optionen.status);
  }

  if (typeof optionen.teamId === "number") {
    suchParameter.set("teamId", String(optionen.teamId));
  }

  const schluessel = `/api/spiele?${suchParameter.toString()}`;
  const { data, error, isLoading, mutate } = useSWR<{ daten: Spiel[]; zuletztAktualisiert: string }>(schluessel, ladeJson, {
    refreshInterval: optionen.bereich === "heute" || optionen.bereich === "live" ? 60000 : 0,
    revalidateOnFocus: true
  });

  return {
    spiele: data?.daten ?? [],
    zuletztAktualisiert: data?.zuletztAktualisiert,
    istLadend: isLoading,
    fehler: error instanceof Error ? error.message : undefined,
    neuLaden: mutate
  };
}
