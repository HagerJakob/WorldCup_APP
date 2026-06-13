import useSWR from "swr";
import { ladeSpiele } from "../api";
import type { Spiel } from "../types";

type Filter = "alle" | "heute" | "naechste" | "live" | "favoriten";

type Optionen = {
  bereich?: Filter;
  filter?: Filter;
};

export function useSpiele(optionen: Optionen = {}) {
  const suchParameter = new URLSearchParams();
  if (optionen.bereich) suchParameter.set("bereich", optionen.bereich);
  if (optionen.filter) suchParameter.set("filter", optionen.filter);

  const schluessel = `/api/spiele?${suchParameter.toString()}`;
  const { data, error, isLoading, mutate } = useSWR<{ daten: Spiel[]; zuletztAktualisiert: string }>(schluessel, ladeSpiele, {
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
