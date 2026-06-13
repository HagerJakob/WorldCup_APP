import useSWR from "swr";
import { ladeTabellen } from "../api";
import { formatiereAbschnittName } from "../format";
import { useFavoritenTeams } from "../hooks/useFavoritenTeams";
import type { Gruppe, TabellenZeile } from "../types";
import { LadePlatzhalter } from "./LadePlatzhalter";

type DritterPlatz = TabellenZeile & {
  gruppe: string;
};

function FlaggenBild({ wert, name }: { wert?: string; name: string }) {
  if (!wert) {
    return <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-sm">🏳️</span>;
  }

  if (wert.startsWith("http://") || wert.startsWith("https://")) {
    return <img src={wert} alt={name} className="h-14 w-14 rounded-2xl border border-white/40 object-cover shadow-md" loading="lazy" />;
  }

  return <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-sm">{wert}</span>;
}

function sortiereGruppendritte(gruppen: Gruppe[]): DritterPlatz[] {
  return gruppen
    .map((gruppe) => {
      const dritter = gruppe.zeilen.find((zeile) => zeile.platz === 3) ?? gruppe.zeilen[2];
      return dritter ? { ...dritter, gruppe: formatiereAbschnittName(gruppe.name) } : undefined;
    })
    .filter((zeile): zeile is DritterPlatz => Boolean(zeile))
    .sort((a, b) => b.punkte - a.punkte || b.tordifferenz - a.tordifferenz || b.toreFuer - a.toreFuer || a.team.name.localeCompare(b.team.name, "de-AT"));
}

function TeamZelle({ zeile, istFavorit }: { zeile: TabellenZeile; istFavorit?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <FlaggenBild wert={zeile.team.flagge} name={zeile.team.name} />
      <div>
        <p className="flex items-center gap-2 text-lg font-black leading-tight text-white">
          <span>{zeile.team.name}</span>
          {istFavorit ? <span className="text-sm text-[#b7f200]" title="Favorit">♥</span> : null}
        </p>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">{zeile.team.kuerzel ?? ""}</p>
      </div>
    </div>
  );
}

function GruppendritteTabelle({ gruppen }: { gruppen: Gruppe[] }) {
  const dritte = sortiereGruppendritte(gruppen);
  const { favoritenSet } = useFavoritenTeams();

  return (
    <section className="glas-karte rounded-[1.75rem] p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.16)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/70">Ranking</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-white">Alle Gruppendritten</h2>
          <p className="mt-2 text-sm font-semibold text-white/70">Sortiert nach Punkte, Tordifferenz und erzielten Toren.</p>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/85 backdrop-blur">3. Plätze</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-base">
          <thead className="sticky top-0 z-10 bg-white/10 text-white backdrop-blur-md">
            <tr className="text-sm uppercase tracking-[0.18em]">
              <th className="rounded-l-2xl px-4 py-4">#</th>
              <th className="px-4 py-4">Mannschaft</th>
              <th className="px-4 py-4 text-center">Gruppe</th>
              <th className="px-4 py-4 text-center">Spiele</th>
              <th className="px-4 py-4 text-center">Tore</th>
              <th className="px-4 py-4 text-center">Diff</th>
              <th className="rounded-r-2xl px-4 py-4 text-center">Pkt</th>
            </tr>
          </thead>
          <tbody>
            {dritte.map((zeile, index) => (
              <tr key={`${zeile.gruppe}-${zeile.team.id}`} className="border-b border-white/10 bg-white/6 text-white transition hover:bg-white/10">
                <td className="px-4 py-4 align-middle font-black text-white/90">{index + 1}</td>
                <td className="px-4 py-4 align-middle">
                  <TeamZelle zeile={zeile} istFavorit={favoritenSet.has(zeile.team.id)} />
                </td>
                <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.gruppe}</td>
                <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.spiele}</td>
                <td className="px-4 py-4 text-center font-semibold text-white/90">
                  {zeile.toreFuer}:{zeile.toreGegen}
                </td>
                <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.tordifferenz}</td>
                <td className="px-4 py-4 text-center font-black text-white">{zeile.punkte}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dritte.length === 0 ? <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 text-base font-semibold text-white/80 backdrop-blur">Noch keine Gruppendritten vorhanden.</div> : null}
    </section>
  );
}

export function TabellenBereich() {
  const { data, error, isLoading } = useSWR("/api/standings", ladeTabellen, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  });
  const { favoritenSet } = useFavoritenTeams();

  if (error) {
    return <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-base font-semibold text-red-900">Die Tabelle ist gerade nicht verfügbar.</div>;
  }

  if (isLoading) {
    return <LadePlatzhalter zeilen={4} />;
  }

  const gruppen = data?.daten ?? [];

  return (
    <div className="space-y-6">
      {gruppen.map((gruppe) => (
        <section key={gruppe.name} className="glas-karte rounded-[1.75rem] p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.16)] sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/70">Gruppe</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-white">{formatiereAbschnittName(gruppe.name)}</h2>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/85 backdrop-blur">Aktuelle Tabelle</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-base">
              <thead className="sticky top-0 z-10 bg-white/10 text-white backdrop-blur-md">
                <tr className="text-sm uppercase tracking-[0.18em]">
                  <th className="rounded-l-2xl px-4 py-4">#</th>
                  <th className="px-4 py-4">Mannschaft</th>
                  <th className="px-4 py-4 text-center">Spiele</th>
                  <th className="px-4 py-4 text-center">S</th>
                  <th className="px-4 py-4 text-center">U</th>
                  <th className="px-4 py-4 text-center">N</th>
                  <th className="px-4 py-4 text-center">Tore</th>
                  <th className="px-4 py-4 text-center">Diff</th>
                  <th className="rounded-r-2xl px-4 py-4 text-center">Pkt</th>
                </tr>
              </thead>
              <tbody>
                {gruppe.zeilen.map((zeile) => (
                  <tr key={zeile.team.id} className="group border-b border-white/10 bg-white/6 text-white transition hover:bg-white/10">
                    <td className="px-4 py-4 align-middle font-black text-white/90">{zeile.platz}</td>
                    <td className="px-4 py-4 align-middle">
                      <TeamZelle zeile={zeile} istFavorit={favoritenSet.has(zeile.team.id)} />
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.spiele}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.siege}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.unentschieden}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.niederlagen}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">
                      {zeile.toreFuer}:{zeile.toreGegen}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.tordifferenz}</td>
                    <td className="px-4 py-4 text-center font-black text-white">{zeile.punkte}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {gruppen.length ? <GruppendritteTabelle gruppen={gruppen} /> : null}
      {gruppen.length === 0 ? <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 text-base font-semibold text-white/80 backdrop-blur">Noch keine Tabellen vorhanden.</div> : null}
    </div>
  );
}
