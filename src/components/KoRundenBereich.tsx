import useSWR from "swr";
import { ladeSpiele, ladeTabellen } from "../api";
import { useFavoritenTeams } from "../hooks/useFavoritenTeams";
import { generiereTurnierbaum, type KoSpiel, type KoTeilnehmer } from "../ko/turnierbaum";
import { LadePlatzhalter } from "./LadePlatzhalter";

const SPALTEN_BREITE = 260;
const SPALTEN_ABSTAND = 52;
const ZEILEN_HOEHE = 40;
const ZEILEN_ABSTAND = 10;
const KARTEN_HOEHE = 154;
const BRACKET_SPALTEN = 5;
const BRACKET_ZEILEN = 66;

const BRACKET_RUNDEN: Array<{ runde: KoSpiel["runde"]; spalte: number; startZeile: (index: number) => number }> = [
  { runde: "Sechzehntelfinale", spalte: 1, startZeile: (index) => index * 4 + 1 },
  { runde: "Achtelfinale", spalte: 2, startZeile: (index) => index * 8 + 3 },
  { runde: "Viertelfinale", spalte: 3, startZeile: (index) => index * 16 + 7 },
  { runde: "Halbfinale", spalte: 4, startZeile: (index) => index * 32 + 15 },
  { runde: "Finale", spalte: 5, startZeile: () => 31 }
];

const MATCH_REIHENFOLGE: Record<KoSpiel["runde"], number[]> = {
  // Diese Reihenfolge ist die optische Baum-Reihenfolge, nicht die chronologische
  // Matchnummer-Reihenfolge. So stehen die Spiele, deren Sieger im selben Folgematch
  // landen, direkt nebeneinander und im weiteren Halbfinalpfad untereinander.
  Sechzehntelfinale: [73, 75, 74, 77, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87],
  Achtelfinale: [89, 90, 93, 94, 91, 92, 95, 96],
  Viertelfinale: [97, 98, 99, 100],
  Halbfinale: [101, 102],
  Finale: [104],
  "Spiel um Platz 3": [103]
};

const WEITERKOMMENDE_MATCHES: Record<number, number> = {
  73: 89,
  75: 89,
  74: 90,
  77: 90,
  76: 91,
  78: 91,
  79: 92,
  80: 92,
  83: 93,
  84: 93,
  81: 94,
  82: 94,
  86: 95,
  88: 95,
  85: 96,
  87: 96,
  89: 97,
  90: 97,
  93: 98,
  94: 98,
  91: 99,
  92: 99,
  95: 100,
  96: 100,
  97: 101,
  98: 101,
  99: 102,
  100: 102,
  101: 104,
  102: 104
};

type Position = {
  spalte: number;
  startZeile: number;
};

function TeilnehmerZeile({ teilnehmer }: { teilnehmer: KoTeilnehmer }) {
  const { favoritenSet } = useFavoritenTeams();
  const istFavorit = typeof teilnehmer.team?.id === "number" && favoritenSet.has(teilnehmer.team.id);

  return (
    <div className="flex min-h-11 items-center gap-3 rounded-2xl bg-white/8 px-3 py-2">
      {teilnehmer.team?.flagge ? (
        teilnehmer.team.flagge.startsWith("http") ? (
          <img src={teilnehmer.team.flagge} alt={teilnehmer.team.name} className="h-8 w-10 rounded-lg border border-white/30 object-cover" loading="lazy" />
        ) : (
          <span className="text-2xl" aria-hidden="true">
            {teilnehmer.team.flagge}
          </span>
        )
      ) : (
        <span className="flex h-8 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/8 text-xs font-black text-white/60">{teilnehmer.platz ? `${teilnehmer.platz}.` : "W"}</span>
      )}
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-black text-white">
          <span className="truncate">{teilnehmer.label}</span>
          {istFavorit ? <span className="shrink-0 text-xs text-[#b7f200]" title="Favorit">♥</span> : null}
        </p>
        {teilnehmer.gruppe ? <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/55">Gruppe {teilnehmer.gruppe}</p> : null}
      </div>
    </div>
  );
}

function MatchKarte({ spiel }: { spiel: KoSpiel }) {
  const zeigtErgebnis = typeof spiel.heimTore === "number" && typeof spiel.gastTore === "number";

  return (
    <article className="ko-match glas-karte relative rounded-[1.25rem] p-3 text-white">
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/60">Match {spiel.nummer}</p>
          <p className="mt-1 truncate text-xs font-semibold text-white/75">
            {spiel.datum}
            {spiel.ort ? ` · ${spiel.ort}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-[0.65rem] font-black text-white/80">{spiel.runde}</span>
          {spiel.istFixiert ? <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-emerald-100">Fixiert</span> : null}
        </div>
      </div>
      <div className="space-y-2">
        <TeilnehmerZeile teilnehmer={spiel.teamA} />
        <TeilnehmerZeile teilnehmer={spiel.teamB} />
      </div>
      {zeigtErgebnis ? (
        <p className="mt-2 rounded-xl bg-white/10 px-3 py-2 text-center text-sm font-black text-white">
          {spiel.heimTore}:{spiel.gastTore}
        </p>
      ) : null}
    </article>
  );
}

function xLinks(position: Position) {
  return (position.spalte - 1) * (SPALTEN_BREITE + SPALTEN_ABSTAND);
}

function yOben(position: Position) {
  return (position.startZeile - 1) * (ZEILEN_HOEHE + ZEILEN_ABSTAND);
}

function ankerRechts(position: Position) {
  return {
    x: xLinks(position) + SPALTEN_BREITE,
    y: yOben(position) + KARTEN_HOEHE / 2
  };
}

function ankerLinks(position: Position) {
  return {
    x: xLinks(position),
    y: yOben(position) + KARTEN_HOEHE / 2
  };
}

function verbindungsPfad(von: Position, nach: Position) {
  const start = ankerRechts(von);
  const ziel = ankerLinks(nach);
  const mitteX = start.x + (ziel.x - start.x) / 2;

  return `M ${start.x} ${start.y} H ${mitteX} V ${ziel.y} H ${ziel.x}`;
}

function BracketLinien({ positionen }: { positionen: Map<number, Position> }) {
  const breite = BRACKET_SPALTEN * SPALTEN_BREITE + (BRACKET_SPALTEN - 1) * SPALTEN_ABSTAND;
  const hoehe = BRACKET_ZEILEN * ZEILEN_HOEHE + (BRACKET_ZEILEN - 1) * ZEILEN_ABSTAND;

  return (
    <svg className="ko-bracket-lines" viewBox={`0 0 ${breite} ${hoehe}`} aria-hidden="true">
      {Object.entries(WEITERKOMMENDE_MATCHES).map(([vonMatch, nachMatch]) => {
        const von = positionen.get(Number(vonMatch));
        const nach = positionen.get(nachMatch);
        if (!von || !nach) return null;

        return <path key={`${vonMatch}-${nachMatch}`} d={verbindungsPfad(von, nach)} />;
      })}
    </svg>
  );
}

function berechnePositionen(spiele: KoSpiel[]) {
  const positionen = new Map<number, Position>();
  const spieleNachNummer = new Map(spiele.map((spiel) => [spiel.nummer, spiel]));

  for (const runde of BRACKET_RUNDEN) {
    const spieleDerRunde = MATCH_REIHENFOLGE[runde.runde].map((nummer) => spieleNachNummer.get(nummer)).filter((spiel): spiel is KoSpiel => Boolean(spiel));
    spieleDerRunde.forEach((spiel, index) => {
      positionen.set(spiel.nummer, {
        spalte: runde.spalte,
        startZeile: runde.startZeile(index)
      });
    });
  }

  const dritterPlatz = spiele.find((spiel) => spiel.runde === "Spiel um Platz 3");
  if (dritterPlatz) {
    positionen.set(dritterPlatz.nummer, { spalte: 5, startZeile: 47 });
  }

  return positionen;
}

function BracketRaster({ spiele }: { spiele: KoSpiel[] }) {
  const positionen = berechnePositionen(spiele);
  const sortierteSpiele = [...spiele].sort((a, b) => {
    const rundeA = MATCH_REIHENFOLGE[a.runde].indexOf(a.nummer);
    const rundeB = MATCH_REIHENFOLGE[b.runde].indexOf(b.nummer);
    return rundeA - rundeB;
  });

  return (
    <div className="overflow-x-auto pb-3">
      <div className="ko-bracket-grid min-w-[1480px]">
        <BracketLinien positionen={positionen} />
        {sortierteSpiele.map((spiel) => {
          const position = positionen.get(spiel.nummer);
          if (!position) return null;

          return (
            <div
              key={spiel.nummer}
              className="ko-bracket-slot"
              style={{
                gridColumn: position.spalte,
                gridRow: `${position.startZeile} / span 4`
              }}
            >
              <MatchKarte spiel={spiel} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function KoRundenBereich() {
  const {
    data: tabellenData,
    error: tabellenFehler,
    isLoading: tabellenLaden
  } = useSWR("/api/standings", ladeTabellen, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  });
  const {
    data: spieleData,
    error: spieleFehler,
    isLoading: spieleLaden
  } = useSWR("/api/spiele?bereich=alle", ladeSpiele, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  });

  if (tabellenFehler || spieleFehler) {
    return <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-base font-semibold text-red-900">Der KO-Baum konnte gerade nicht geladen werden.</div>;
  }

  if (tabellenLaden || spieleLaden) {
    return <LadePlatzhalter zeilen={5} />;
  }

  const gruppen = tabellenData?.daten ?? [];
  const spiele = spieleData?.daten ?? [];
  const turnierbaum = generiereTurnierbaum(gruppen, spiele);

  return (
    <div className="space-y-6">
      <div className="scharf-karte rounded-[1.75rem] border border-slate-200 p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--farb-primary)]">FIFA Annex C</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Drittplatzierten-Schlüssel: {turnierbaum.drittplatzSchluessel}</h2>
        <p className="mt-3 text-base leading-7 text-slate-700">
          Die acht besten Gruppendritten werden zuerst ermittelt. Danach werden nur ihre Gruppenbuchstaben alphabetisch sortiert. Dieser Schlüssel wählt die feste FIFA-Zuordnung für die Gegner der Gruppensieger.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {turnierbaum.besteDritte.map((dritter, index) => (
            <span key={dritter.gruppe} className="rounded-full border border-[#b7f200]/55 bg-[#b7f200]/14 px-4 py-2 text-sm font-black text-[#efffe8] shadow-[0_0_20px_rgba(183,242,0,0.12)]">
              {index + 1}. {dritter.team.name} · Gruppe {dritter.gruppe}
            </span>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--farb-primary)]">Turnierbaum</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">KO-Runden-Bracket</h2>
          </div>
          <p className="text-sm font-semibold text-slate-600">Horizontal scrollen, um den ganzen Baum zu sehen.</p>
        </div>
        <BracketRaster spiele={turnierbaum.spiele} />
      </section>
    </div>
  );
}
