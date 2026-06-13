import { baueIcsInhalt, ladeSpielNachId, ladeSpieleMitFilter, ladeStandings } from "./data";

const port = Number(process.env.PORT ?? 3001);

function json(daten: unknown, init?: ResponseInit) {
  return Response.json(daten, {
    ...init,
    headers: {
      "Access-Control-Allow-Origin": "*",
      ...(init?.headers ?? {})
    }
  });
}

async function apiAntwort(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);

  try {
    if (url.pathname === "/api/spiele") {
      const bereich = url.searchParams.get("bereich") ?? "alle";
      const filter = url.searchParams.get("filter") ?? undefined;
      const spiele = await ladeSpieleMitFilter(bereich, filter);
      return json({ daten: spiele, zuletztAktualisiert: new Date().toISOString() });
    }

    if (url.pathname === "/api/standings") {
      const daten = await ladeStandings();
      return json({ daten, zuletztAktualisiert: new Date().toISOString() });
    }

    const kalenderTreffer = url.pathname.match(/^\/api\/kalender\/(\d+)$/);
    if (kalenderTreffer) {
      const spiel = await ladeSpielNachId(Number(kalenderTreffer[1]));
      if (!spiel) return json({ nachricht: "Spiel nicht gefunden." }, { status: 404 });

      return new Response(baueIcsInhalt(spiel), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="wm2026-${spiel.id}.ics"`
        }
      });
    }
  } catch (fehler) {
    const nachricht = fehler instanceof Error ? fehler.message : "Die Daten konnten nicht geladen werden.";
    return json({ nachricht }, { status: 503 });
  }

  return undefined;
}

async function staticAntwort(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pfad = url.pathname === "/" ? "/index.html" : url.pathname;
  const datei = Bun.file(`dist${pfad}`);

  if (await datei.exists()) return new Response(datei);
  return new Response(Bun.file("dist/index.html"));
}

Bun.serve({
  port,
  async fetch(request) {
    const api = await apiAntwort(request);
    if (api) return api;
    return staticAntwort(request);
  }
});

console.log(`WM 2026 API läuft auf http://localhost:${port}`);
