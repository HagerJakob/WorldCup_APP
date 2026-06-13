import type { ApiAntwort, Gruppe, Spiel } from "./types";

async function ladeJson<T>(url: string): Promise<T> {
  const antwort = await fetch(url);
  if (!antwort.ok) {
    const fehler = (await antwort.json().catch(() => null)) as { nachricht?: string } | null;
    throw new Error(fehler?.nachricht ?? `Fehler beim Laden von ${url}`);
  }
  return (await antwort.json()) as T;
}

export function ladeSpiele(url: string) {
  return ladeJson<ApiAntwort<Spiel[]>>(url);
}

export function ladeTabellen() {
  return ladeJson<ApiAntwort<Gruppe[]>>("/api/standings");
}
