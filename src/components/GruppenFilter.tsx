import { useSearchParams } from "react-router-dom";

const filter = [
  { wert: "alle", beschriftung: "Alle" },
  { wert: "heute", beschriftung: "Heute" },
  { wert: "naechste", beschriftung: "Nächste" },
  { wert: "live", beschriftung: "Live" },
  { wert: "favoriten", beschriftung: "Favoriten" }
] as const;

export function GruppenFilter() {
  const [suchParameter, setSuchParameter] = useSearchParams();
  const aktiverFilter = suchParameter.get("filter") ?? "alle";

  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1 scrollbar-hide sm:w-auto sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
      {filter.map((eintrag) => {
        const aktiv = aktiverFilter === eintrag.wert;
        return (
          <button
            key={eintrag.wert}
            type="button"
            onClick={() => setSuchParameter({ filter: eintrag.wert })}
            className={`min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:px-5 sm:py-3 sm:text-base ${
              aktiv ? "border-[#b7f200] bg-[#b7f200] text-[#034d3f] shadow-[0_0_28px_rgba(183,242,0,0.24)]" : "border-[#63f0d5]/30 bg-white/10 text-white/85 backdrop-blur hover:border-[#63f0d5]/55 hover:bg-white/16"
            }`}
          >
            {eintrag.beschriftung}
          </button>
        );
      })}
    </div>
  );
}
