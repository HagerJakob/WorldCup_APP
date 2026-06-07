"use client";

import type { Spiel } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useSpiele } from "@/hooks/useSpiele";
import { SpielKarte } from "@/components/SpielKarte";
import { LadePlatzhalter } from "@/components/LadePlatzhalter";
import { GruppenFilter } from "@/components/GruppenFilter";
import { LiveBadge } from "@/components/LiveBadge";
import { gruppiereNachTag } from "@/lib/api";

function SpielListe({ spiele }: { spiele: Spiel[] }) {
  const gruppen = gruppiereNachTag(spiele);

  return (
    <div className="space-y-8">
      {gruppen.map((gruppe) => (
        <section key={gruppe.tag} className="space-y-4">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{gruppe.tag}</h2>
          <div className="grid gap-4">
            {gruppe.spiele.map((spiel) => (
              <SpielKarte
                key={spiel.id}
                heimTeam={spiel.heimTeam.name}
                gastTeam={spiel.gastTeam.name}
                heimFlagge={spiel.heimTeam.flagge ?? "🏳️"}
                gastFlagge={spiel.gastTeam.flagge ?? "🏳️"}
                anpfiff={spiel.anpfiff}
                status={spiel.status}
                heimTore={spiel.heimTore}
                gastTore={spiel.gastTore}
                minute={spiel.minute}
                stadion={spiel.stadion}
                gruppe={spiel.gruppe}
                kalenderHref={`/api/kalender/${spiel.id}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function SpieleBereich({ bereich }: { bereich: "heute" | "naechste" | "alle" | "live" | "favoriten" }) {
  const suchParameter = useSearchParams();
  const filter = (suchParameter.get("filter") ?? undefined) as "alle" | "heute" | "naechste" | "live" | "favoriten" | undefined;
  const { spiele, istLadend, fehler, zuletztAktualisiert } = useSpiele({ bereich, filter: filter === "alle" ? undefined : filter });

  if (fehler) {
    return (
      <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-base font-semibold text-red-900">
        Die Spiele konnten gerade nicht geladen werden. Bitte später noch einmal versuchen.
      </div>
    );
  }

  if (istLadend) {
    return <LadePlatzhalter zeilen={bereich === "heute" ? 2 : 4} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <GruppenFilter />
        {zuletztAktualisiert ? (
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--farb-karton)] px-4 py-3 text-sm font-semibold text-slate-700">
            <span>Zuletzt aktualisiert: {new Intl.DateTimeFormat("de-AT", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Vienna" }).format(new Date(zuletztAktualisiert))}</span>
            <LiveBadge />
          </div>
        ) : null}
      </div>

      <SpielListe spiele={spiele} />
      {spiele.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-base font-semibold text-slate-700">
          Für diesen Bereich gibt es gerade keine Spiele.
        </div>
      ) : null}
    </div>
  );
}

export function SpieleMitFilter({ bereich }: { bereich: "heute" | "naechste" | "alle" | "live" | "favoriten" }) {
  return <SpieleBereich bereich={bereich} />;
}
