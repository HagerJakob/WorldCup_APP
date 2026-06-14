import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { istFavoritenSpiel } from "../favoriten";
import { gruppiereNachTag } from "../format";
import { useFavoritenTeams } from "../hooks/useFavoritenTeams";
import { useSpiele } from "../hooks/useSpiele";
import type { Spiel } from "../types";
import { GruppenFilter } from "./GruppenFilter";
import { LadePlatzhalter } from "./LadePlatzhalter";
import { LiveBadge } from "./LiveBadge";
import { SpielKarte } from "./SpielKarte";

function SpielListe({ spiele }: { spiele: Spiel[] }) {
  const gruppen = gruppiereNachTag(spiele);

  return (
    <div className="space-y-6 sm:space-y-8">
      {gruppen.map((gruppe) => (
        <section key={gruppe.tag} className="space-y-3 sm:space-y-4">
          <h2 className="text-xl font-black tracking-tight text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.28)] sm:text-3xl">{gruppe.tag}</h2>
          <div className="grid gap-4">
            {gruppe.spiele.map((spiel) => (
              <SpielKarte
                key={spiel.id}
                heimTeam={spiel.heimTeam.name}
                gastTeam={spiel.gastTeam.name}
                heimTeamId={spiel.heimTeam.id}
                gastTeamId={spiel.gastTeam.id}
                heimFlagge={spiel.heimTeam.flagge ?? "🏳️"}
                gastFlagge={spiel.gastTeam.flagge ?? "🏳️"}
                anpfiff={spiel.anpfiff}
                status={spiel.status}
                heimTore={spiel.heimTore}
                gastTore={spiel.gastTore}
                minute={spiel.minute}
                stadion={spiel.stadion}
                gruppe={spiel.gruppe}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function SpieleBereich({ bereich }: { bereich: "heute" | "naechste" | "alle" | "live" | "favoriten" }) {
  const [suchParameter] = useSearchParams();
  const filter = (suchParameter.get("filter") ?? undefined) as "alle" | "heute" | "naechste" | "live" | "favoriten" | undefined;
  const favoritenAktiv = bereich === "favoriten" || filter === "favoriten";
  const { favoritenSet } = useFavoritenTeams();
  const { spiele, istLadend, fehler, zuletztAktualisiert } = useSpiele({
    bereich: favoritenAktiv ? "alle" : bereich,
    filter: filter === "alle" || filter === "favoriten" ? undefined : filter
  });

  const angezeigteSpiele = useMemo(() => {
    if (!favoritenAktiv) return spiele;
    return spiele.filter((spiel) => istFavoritenSpiel(spiel, favoritenSet));
  }, [favoritenAktiv, favoritenSet, spiele]);

  if (fehler) {
    return <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-base font-semibold text-red-900">Die Spiele konnten gerade nicht geladen werden. Bitte später noch einmal versuchen.</div>;
  }

  if (istLadend) {
    return <LadePlatzhalter zeilen={bereich === "heute" ? 2 : 4} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <GruppenFilter />
        {zuletztAktualisiert ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-200/25 bg-white/12 px-4 py-3 text-sm font-semibold text-white/85 backdrop-blur sm:justify-start">
            <span>Zuletzt aktualisiert: {new Intl.DateTimeFormat("de-AT", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Vienna" }).format(new Date(zuletztAktualisiert))}</span>
            <LiveBadge />
          </div>
        ) : null}
      </div>

      <SpielListe spiele={angezeigteSpiele} />
      {angezeigteSpiele.length === 0 ? <div className="scharf-karte rounded-[1.5rem] p-6 text-base font-semibold text-white/80">Für diesen Bereich gibt es gerade keine Spiele mit deinen favorisierten Teams.</div> : null}
    </div>
  );
}
