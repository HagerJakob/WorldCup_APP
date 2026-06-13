import { ladeStandings } from "../server/data";

function json(daten: unknown, init?: ResponseInit) {
  return Response.json(daten, {
    ...init,
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      ...(init?.headers ?? {})
    }
  });
}

export default {
  async fetch() {
    try {
      const daten = await ladeStandings();
      return json({ daten, zuletztAktualisiert: new Date().toISOString() });
    } catch (fehler) {
      const nachricht = fehler instanceof Error ? fehler.message : "Die Tabellen konnten nicht geladen werden.";
      return json({ nachricht }, { status: 503 });
    }
  }
};
