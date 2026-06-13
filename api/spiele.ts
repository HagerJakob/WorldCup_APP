import type { IncomingMessage, ServerResponse } from "node:http";
import { ladeSpieleMitFilter } from "../server/data.ts";

type ApiRequest = IncomingMessage & {
  query?: Record<string, string | string[]>;
};

function ersterWert(wert: string | string[] | undefined) {
  return Array.isArray(wert) ? wert[0] : wert;
}

function sendeJson(response: ServerResponse, status: number, daten: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  response.end(JSON.stringify(daten));
}

export default async function handler(request: ApiRequest, response: ServerResponse) {
  const url = new URL(request.url ?? "/api/spiele", "https://wm2026.local");
  const bereich = ersterWert(request.query?.bereich) ?? url.searchParams.get("bereich") ?? "alle";
  const filter = ersterWert(request.query?.filter) ?? url.searchParams.get("filter") ?? undefined;

  try {
    const spiele = await ladeSpieleMitFilter(bereich, filter);
    sendeJson(response, 200, { daten: spiele, zuletztAktualisiert: new Date().toISOString() });
  } catch (fehler) {
    const nachricht = fehler instanceof Error ? fehler.message : "Die Spiele konnten nicht geladen werden.";
    sendeJson(response, 503, { nachricht });
  }
}
