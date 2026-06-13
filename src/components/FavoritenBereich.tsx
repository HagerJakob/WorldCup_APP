import { useMemo, useState } from "react";
import type { Mannschaft, Spiel } from "../types";
import { useFavoritenTeams } from "../hooks/useFavoritenTeams";
import { useSpiele } from "../hooks/useSpiele";
import { LadePlatzhalter } from "./LadePlatzhalter";

function FlaggenBild({ wert, name }: { wert?: string; name: string }) {
  if (!wert) {
    return <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">🏳️</span>;
  }

  if (wert.startsWith("http://") || wert.startsWith("https://")) {
    return <img src={wert} alt={name} className="h-12 w-12 rounded-2xl border border-white/30 object-cover shadow-sm" loading="lazy" />;
  }

  return <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">{wert}</span>;
}

function istEchtesTeam(team: Mannschaft) {
  const name = team.name.trim().toLowerCase();
  return team.id > 0 && name.length > 0 && name !== "unbekannt" && !name.includes("unknown");
}

function sammleTeams(spiele: Spiel[]): Mannschaft[] {
  const teams = new Map<number, Mannschaft>();

  for (const spiel of spiele) {
    if (istEchtesTeam(spiel.heimTeam)) teams.set(spiel.heimTeam.id, spiel.heimTeam);
    if (istEchtesTeam(spiel.gastTeam)) teams.set(spiel.gastTeam.id, spiel.gastTeam);
  }

  return [...teams.values()].sort((a, b) => a.name.localeCompare(b.name, "de-AT"));
}

export function FavoritenBereich() {
  const [suche, setSuche] = useState("");
  const { spiele, istLadend, fehler } = useSpiele({ bereich: "alle" });
  const { favoritenIds, favoritenSet, istFavorit, toggleFavorit } = useFavoritenTeams();

  const teams = useMemo(() => sammleTeams(spiele), [spiele]);
  const ausgewaehlteTeams = useMemo(() => teams.filter((team) => favoritenSet.has(team.id)), [favoritenSet, teams]);
  const gefilterteTeams = useMemo(() => {
    const suchtext = suche.trim().toLowerCase();
    if (!suchtext) return teams;
    return teams.filter((team) => `${team.name} ${team.kuerzel ?? ""}`.toLowerCase().includes(suchtext));
  }, [suche, teams]);

  if (fehler) {
    return <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-base font-semibold text-red-900">Die Teams konnten gerade nicht geladen werden. Bitte später noch einmal versuchen.</div>;
  }

  if (istLadend) {
    return <LadePlatzhalter zeilen={5} />;
  }

  return (
    <div className="space-y-5">
      <div className="scharf-karte rounded-[1.75rem] border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--farb-primary)]">Unterstützte Teams</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{ausgewaehlteTeams.length ? `${ausgewaehlteTeams.length} ausgewählt` : "Noch kein Team ausgewählt"}</h3>
          </div>
          <label className="w-full max-w-md">
            <span className="mb-2 block text-sm font-bold text-slate-700">Team suchen</span>
            <input
              type="search"
              value={suche}
              onChange={(event) => setSuche(event.target.value)}
              placeholder="z. B. Deutschland, Brasilien..."
              className="w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-base font-semibold text-white outline-none transition placeholder:text-white/50 focus:border-[#63f0d5] focus:ring-4 focus:ring-[#63f0d5]/15"
            />
          </label>
        </div>

        {ausgewaehlteTeams.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {ausgewaehlteTeams.map((team) => (
              <span key={team.id} className="inline-flex items-center gap-2 rounded-full border border-[#b7f200]/55 bg-[#b7f200]/14 px-4 py-2 text-sm font-black text-[#efffe8] shadow-[0_0_20px_rgba(183,242,0,0.12)]">
                <span aria-hidden="true">♥</span>
                {team.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {gefilterteTeams.map((team) => {
          const aktiv = istFavorit(team.id);

          return (
            <article key={team.id} className={`glas-karte flex items-center justify-between gap-4 rounded-[1.5rem] p-4 text-white transition ${aktiv ? "ring-2 ring-[var(--farb-akzent)]" : ""}`}>
              <div className="flex min-w-0 items-center gap-3">
                <FlaggenBild wert={team.flagge} name={team.name} />
                <div className="min-w-0">
                  <p className="truncate text-lg font-black text-white">{team.name}</p>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">{team.kuerzel ?? "Team"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleFavorit(team.id)}
                aria-pressed={aktiv}
                aria-label={aktiv ? `${team.name} nicht mehr unterstützen` : `${team.name} unterstützen`}
                title={aktiv ? "Nicht mehr unterstützen" : "Team unterstützen"}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-2xl font-black transition ${
                  aktiv ? "border-[#b7f200]/70 bg-[#b7f200]/16 text-[#efffe8] shadow-[0_0_24px_rgba(183,242,0,0.2)]" : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                {aktiv ? "♥" : "♡"}
              </button>
            </article>
          );
        })}
      </div>

      {gefilterteTeams.length === 0 ? <div className="scharf-karte rounded-[1.5rem] p-6 text-base font-semibold text-white/80">Kein Team für diese Suche gefunden.</div> : null}
    </div>
  );
}
