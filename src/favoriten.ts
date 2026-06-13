import type { Spiel } from "./types";

export function istFavoritenSpiel(spiel: Spiel, favoritenSet: Set<number>) {
  return favoritenSet.has(spiel.heimTeam.id) || favoritenSet.has(spiel.gastTeam.id);
}
