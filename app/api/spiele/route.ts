import { NextResponse } from "next/server";
import { ladeSpieleMitFilter } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bereich = url.searchParams.get("bereich") ?? "alle";
    const filter = url.searchParams.get("filter") ?? undefined;
    const spiele = await ladeSpieleMitFilter(bereich, filter ?? undefined);

    return NextResponse.json({ daten: spiele, zuletztAktualisiert: new Date().toISOString() });
  } catch (fehler) {
    const nachricht = fehler instanceof Error ? fehler.message : "Die Spiele konnten nicht geladen werden.";
    return NextResponse.json({ nachricht }, { status: 503 });
  }
}
