import { baueIcsInhalt, ladeSpielNachId } from "../../server/data";

function json(daten: unknown, init?: ResponseInit) {
  return Response.json(daten, init);
}

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    const id = Number(url.pathname.split("/").filter(Boolean).at(-1));

    if (!Number.isFinite(id)) {
      return json({ nachricht: "Ungueltige Spiel-ID." }, { status: 400 });
    }

    try {
      const spiel = await ladeSpielNachId(id);
      if (!spiel) return json({ nachricht: "Spiel nicht gefunden." }, { status: 404 });

      return new Response(baueIcsInhalt(spiel), {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="wm2026-${spiel.id}.ics"`
        }
      });
    } catch (fehler) {
      const nachricht = fehler instanceof Error ? fehler.message : "Die Kalenderdatei konnte nicht geladen werden.";
      return json({ nachricht }, { status: 503 });
    }
  }
};
