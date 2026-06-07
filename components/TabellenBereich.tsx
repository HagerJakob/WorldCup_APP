"use client";

import Image from "next/image";
import useSWR from "swr";
import type { Gruppe } from "@/lib/types";
import { LadePlatzhalter } from "@/components/LadePlatzhalter";

function FlaggenBild({ wert, name }: { wert?: string; name: string }) {
  if (!wert) {
    return <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-sm">🏳️</span>;
  }

  if (wert.startsWith("http://") || wert.startsWith("https://")) {
    return <Image src={wert} alt={name} width={56} height={42} className="h-14 w-14 rounded-2xl border border-white/40 object-cover shadow-md" unoptimized />;
  }

  return <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-sm">{wert}</span>;
}

async function ladeJson<T>(url: string): Promise<T> {
  const antwort = await fetch(url);
  if (!antwort.ok) {
    throw new Error("Tabellen konnten nicht geladen werden.");
  }
  return (await antwort.json()) as T;
}

export function TabellenBereich() {
  const { data, error, isLoading } = useSWR<{ daten: Gruppe[]; zuletztAktualisiert: string }>("/api/standings", ladeJson, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  });

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
              <h2 className="mt-1 text-3xl font-black tracking-tight text-white">{gruppe.name}</h2>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/85 backdrop-blur">Aktuelle Tabelle</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full border-collapse text-left text-base">
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
                      <div className="flex items-center gap-3">
                        <FlaggenBild wert={zeile.team.flagge} name={zeile.team.name} />
                        <div>
                          <p className="text-lg font-black leading-tight text-white">{zeile.team.name}</p>
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">{zeile.team.kuerzel ?? ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.spiele}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.siege}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.unentschieden}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.niederlagen}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.toreFuer}:{zeile.toreGegen}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white/90">{zeile.tordifferenz}</td>
                    <td className="px-4 py-4 text-center font-black text-white">{zeile.punkte}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {gruppen.length === 0 ? <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 text-base font-semibold text-white/80 backdrop-blur">Noch keine Tabellen vorhanden.</div> : null}
    </div>
  );
}
