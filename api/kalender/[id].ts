import type { IncomingMessage, ServerResponse } from "node:http";
import { baueIcsInhalt, ladeSpielNachId } from "../../server/data.ts";

type ApiRequest = IncomingMessage & {
  query?: Record<string, string | string[]>;
};

function ersterWert(wert: string | string[] | undefined) {
  return Array.isArray(wert) ? wert[0] : wert;
}

function sendeJson(response: ServerResponse, status: number, daten: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(daten));
}

export default async function handler(request: ApiRequest, response: ServerResponse) {
  const url = new URL(request.url ?? "/api/kalender/0", "https://wm2026.local");
  const idAusQuery = ersterWert(request.query?.id);
  const idAusPfad = url.pathname.split("/").filter(Boolean).at(-1);
  const spielId = Number(idAusQuery ?? idAusPfad);

  if (!Number.isFinite(spielId)) {
    sendeJson(response, 400, { nachricht: "Ungueltige Spiel-ID." });
    return;
  }

  try {
    const spiel = await ladeSpielNachId(spielId);
    if (!spiel) {
      sendeJson(response, 404, { nachricht: "Spiel nicht gefunden." });
      return;
    }

    response.statusCode = 200;
    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    response.setHeader("Content-Type", "text/calendar; charset=utf-8");
    response.setHeader("Content-Disposition", `attachment; filename="wm2026-${spiel.id}.ics"`);
    response.end(baueIcsInhalt(spiel));
  } catch (fehler) {
    const nachricht = fehler instanceof Error ? fehler.message : "Die Kalenderdatei konnte nicht geladen werden.";
    sendeJson(response, 503, { nachricht });
  }
}
