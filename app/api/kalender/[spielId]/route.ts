import { NextResponse } from "next/server";
import { baueIcsInhalt, ladeSpielNachId } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ spielId: string }> }) {
  try {
    const { spielId } = await params;
    const spiel = await ladeSpielNachId(Number(spielId));

    if (!spiel) {
      return NextResponse.json({ nachricht: "Spiel nicht gefunden." }, { status: 404 });
    }

    return new NextResponse(baueIcsInhalt(spiel), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="wm2026-${spiel.id}.ics"`
      }
    });
  } catch (fehler) {
    const nachricht = fehler instanceof Error ? fehler.message : "Kalenderdatei konnte nicht erzeugt werden.";
    return NextResponse.json({ nachricht }, { status: 503 });
  }
}
