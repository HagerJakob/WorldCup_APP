import { useEffect, useMemo, useState } from "react";

const SPEICHER_SCHLUESSEL = "wm2026-favoriten-teams";

function leseFavoriten(): number[] {
  try {
    const gespeicherteFavoriten = localStorage.getItem(SPEICHER_SCHLUESSEL);
    if (!gespeicherteFavoriten) return [];
    const parsed = JSON.parse(gespeicherteFavoriten);
    return Array.isArray(parsed) ? parsed.filter((wert): wert is number => typeof wert === "number") : [];
  } catch {
    return [];
  }
}

export function useFavoritenTeams() {
  const [favoritenIds, setFavoritenIds] = useState<number[]>(() => leseFavoriten());

  useEffect(() => {
    localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(favoritenIds));
  }, [favoritenIds]);

  const favoritenSet = useMemo(() => new Set(favoritenIds), [favoritenIds]);

  function toggleFavorit(teamId: number) {
    setFavoritenIds((aktuelleIds) => (aktuelleIds.includes(teamId) ? aktuelleIds.filter((id) => id !== teamId) : [...aktuelleIds, teamId]));
  }

  function istFavorit(teamId: number) {
    return favoritenSet.has(teamId);
  }

  return {
    favoritenIds,
    favoritenSet,
    istFavorit,
    toggleFavorit
  };
}
