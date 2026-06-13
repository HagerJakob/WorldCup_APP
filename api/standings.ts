import type { ServerResponse } from "node:http";
import { ladeStandings } from "./_data.js";

function sendeJson(response: ServerResponse, status: number, daten: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  response.end(JSON.stringify(daten));
}

export default async function handler(_request: unknown, response: ServerResponse) {
  try {
    const daten = await ladeStandings();
    sendeJson(response, 200, { daten, zuletztAktualisiert: new Date().toISOString() });
  } catch (fehler) {
    const nachricht = fehler instanceof Error ? fehler.message : "Die Tabellen konnten nicht geladen werden.";
    sendeJson(response, 503, { nachricht });
  }
}
