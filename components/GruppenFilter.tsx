"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const filter = [
  { wert: "alle", beschriftung: "Alle" },
  { wert: "heute", beschriftung: "Heute" },
  { wert: "naechste", beschriftung: "Nächste" },
  { wert: "live", beschriftung: "Live" },
  { wert: "favoriten", beschriftung: "Favoriten" }
];

export function GruppenFilter() {
  const router = useRouter();
  const pfad = usePathname();
  const suchParameter = useSearchParams();
  const aktiverFilter = suchParameter.get("filter") ?? "alle";

  return (
    <div className="flex flex-wrap gap-3">
      {filter.map((eintrag) => {
        const aktiv = aktiverFilter === eintrag.wert;

        return (
          <button
            key={eintrag.wert}
            type="button"
            onClick={() => {
              const parameter = new URLSearchParams(suchParameter.toString());
              parameter.set("filter", eintrag.wert);
              router.replace(`${pfad}?${parameter.toString()}`);
            }}
            className={`min-h-11 rounded-full border px-5 py-3 text-base font-semibold transition ${
              aktiv
                ? "border-[var(--farb-primary)] bg-[var(--farb-primary)] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {eintrag.beschriftung}
          </button>
        );
      })}
    </div>
  );
}
