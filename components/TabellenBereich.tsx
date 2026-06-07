"use client";

import useSWR from "swr";
import type { Gruppe } from "@/lib/types";
import { LadePlatzhalter } from "@/components/LadePlatzhalter";

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
        <section key={gruppe.name} className="scharf-karte rounded-[1.5rem] border border-slate-200 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900">{gruppe.name}</h2>
            <span className="text-sm font-semibold text-slate-500">Gruppe {gruppe.name}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2 text-left text-base">
              <thead>
                <tr className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Team</th>
                  <th className="px-3 py-2">Spiele</th>
                  <th className="px-3 py-2">S</th>
                  <th className="px-3 py-2">U</th>
                  <th className="px-3 py-2">N</th>
                  <th className="px-3 py-2">Tore</th>
                  <th className="px-3 py-2">Diff</th>
                  <th className="px-3 py-2">Pkt</th>
                </tr>
              </thead>
              <tbody>
                {gruppe.zeilen.map((zeile) => (
                  <tr key={zeile.team.id} className="rounded-2xl bg-[var(--farb-karton)] text-slate-800">
                    <td className="px-3 py-4 font-black text-[var(--farb-primary)]">{zeile.platz}</td>
                    <td className="px-3 py-4 font-bold text-slate-900">{zeile.team.name}</td>
                    <td className="px-3 py-4">{zeile.spiele}</td>
                    <td className="px-3 py-4">{zeile.siege}</td>
                    <td className="px-3 py-4">{zeile.unentschieden}</td>
                    <td className="px-3 py-4">{zeile.niederlagen}</td>
                    <td className="px-3 py-4">{zeile.toreFuer}:{zeile.toreGegen}</td>
                    <td className="px-3 py-4">{zeile.tordifferenz}</td>
                    <td className="px-3 py-4 font-black text-[var(--farb-primary)]">{zeile.punkte}</td>
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
