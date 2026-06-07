"use client";

import Image from "next/image";
import useSWR from "swr";
import type { Gruppe } from "@/lib/types";
import { LadePlatzhalter } from "@/components/LadePlatzhalter";

function FlaggenBild({ wert, name }: { wert?: string; name: string }) {
  if (!wert) {
    return <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xl">🏳️</span>;
  }

  if (wert.startsWith("http://") || wert.startsWith("https://")) {
    return <Image src={wert} alt={name} width={40} height={28} className="h-10 w-10 rounded-full border border-slate-200 object-cover" unoptimized />;
  }

  return <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xl">{wert}</span>;
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
        <section key={gruppe.name} className="scharf-karte rounded-[1.75rem] border border-slate-200 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--farb-primary)]">Gruppe</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{gruppe.name}</h2>
            </div>
            <span className="rounded-full bg-[var(--farb-karton)] px-3 py-2 text-sm font-bold text-slate-700">Aktuelle Tabelle</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full border-collapse text-left text-base">
              <thead className="sticky top-0 z-10 bg-[#173b68] text-white">
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
                  <tr key={zeile.team.id} className="group border-b border-slate-200 bg-white text-slate-800 transition hover:bg-slate-50">
                    <td className="px-4 py-4 align-middle font-black text-[var(--farb-primary)]">{zeile.platz}</td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <FlaggenBild wert={zeile.team.flagge} name={zeile.team.name} />
                        <div>
                          <p className="text-lg font-black leading-tight text-slate-900">{zeile.team.name}</p>
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{zeile.team.kuerzel ?? ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold">{zeile.spiele}</td>
                    <td className="px-4 py-4 text-center font-semibold">{zeile.siege}</td>
                    <td className="px-4 py-4 text-center font-semibold">{zeile.unentschieden}</td>
                    <td className="px-4 py-4 text-center font-semibold">{zeile.niederlagen}</td>
                    <td className="px-4 py-4 text-center font-semibold">{zeile.toreFuer}:{zeile.toreGegen}</td>
                    <td className="px-4 py-4 text-center font-semibold">{zeile.tordifferenz}</td>
                    <td className="px-4 py-4 text-center font-black text-[var(--farb-primary)]">{zeile.punkte}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {gruppen.length === 0 ? <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-base font-semibold text-slate-700">Noch keine Tabellen vorhanden.</div> : null}
    </div>
  );
}
