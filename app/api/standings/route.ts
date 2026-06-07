import { NextResponse } from "next/server";
import { ladeStandings } from "@/lib/api";

export async function GET() {
  try {
    const daten = await ladeStandings();
    return NextResponse.json({ daten, zuletztAktualisiert: new Date().toISOString() });
  } catch (fehler) {
    const nachricht = fehler instanceof Error ? fehler.message : "Die Tabelle konnte nicht geladen werden.";
    return NextResponse.json({ nachricht }, { status: 503 });
  }
}
