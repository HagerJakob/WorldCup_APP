import { ladeSpieleMitFilter } from "../server/data";

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
  async fetch(request: Request) {
    const url = new URL(request.url);
    const bereich = url.searchParams.get("bereich") ?? "alle";
    const filter = url.searchParams.get("filter") ?? undefined;

    try {
      const spiele = await ladeSpieleMitFilter(bereich, filter);
      return json({ daten: spiele, zuletztAktualisiert: new Date().toISOString() });
    } catch (fehler) {
      const nachricht = fehler instanceof Error ? fehler.message : "Die Spiele konnten nicht geladen werden.";
      return json({ nachricht }, { status: 503 });
    }
  }
};
