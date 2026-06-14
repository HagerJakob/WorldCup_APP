import { formatiereAbschnittName, formatiereDatumZeit, formatiereLiveStatus } from "../format";
import { useFavoritenTeams } from "../hooks/useFavoritenTeams";
import { baueGoogleKalenderUrl } from "../kalender";
import type { Spielstatus } from "../types";
import { LiveBadge } from "./LiveBadge";

export interface SpielKarteProps {
  heimTeam: string;
  gastTeam: string;
  heimTeamId?: number;
  gastTeamId?: number;
  heimFlagge: string;
  gastFlagge: string;
  anpfiff: Date | string;
  status: Spielstatus;
  heimTore?: number;
  gastTore?: number;
  minute?: number;
  stadion: string;
  gruppe: string;
}

function FlaggenSymbol({ wert, name }: { wert: string; name: string }) {
  const basisKlasse = "flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/40 bg-white/12 shadow-sm sm:h-12 sm:w-16";

  if (wert.startsWith("http://") || wert.startsWith("https://")) {
    return (
      <span className={basisKlasse}>
        <img src={wert} alt={name} className="h-full w-full object-cover" loading="lazy" />
      </span>
    );
  }

  return (
    <span className={`${basisKlasse} text-2xl sm:text-3xl`} aria-label={name}>
      {wert}
    </span>
  );
}

type ErgebnisRolle = "gewinner" | "verlierer" | "unentschieden";

function ErgebnisGlanz({ rolle, seite }: { rolle?: ErgebnisRolle; seite: "links" | "rechts" }) {
  if (!rolle) return null;

  const farbe = rolle === "gewinner" ? "rgba(34, 197, 94, 0.9)" : rolle === "verlierer" ? "rgba(239, 68, 68, 0.9)" : "rgba(148, 163, 184, 0.9)";
  const weicheFarbe = rolle === "gewinner" ? "rgba(34, 197, 94, 0.34)" : rolle === "verlierer" ? "rgba(239, 68, 68, 0.34)" : "rgba(148, 163, 184, 0.34)";
  const position = seite === "links" ? "left-[-0.6rem]" : "right-[-0.6rem]";

  return (
    <span className={`pointer-events-none absolute top-[-1.8rem] h-36 w-36 rounded-full blur-[2px] ${position}`} aria-hidden="true" style={{ background: `radial-gradient(circle at center, ${farbe} 0%, ${weicheFarbe} 56%, transparent 82%)` }}>
      <span className="absolute left-10 top-10 h-6 w-16 rotate-[-35deg] rounded-full bg-white/50 blur-[1px]" />
    </span>
  );
}

export function SpielKarte(props: SpielKarteProps) {
  const istLive = props.status === "IN_PLAY" || props.status === "PAUSED";
  const istBeendet = props.status === "FINISHED";
  const { favoritenSet } = useFavoritenTeams();
  const heimFavorit = typeof props.heimTeamId === "number" && favoritenSet.has(props.heimTeamId);
  const gastFavorit = typeof props.gastTeamId === "number" && favoritenSet.has(props.gastTeamId);
  const hatErgebnis = istBeendet && typeof props.heimTore === "number" && typeof props.gastTore === "number";
  const istUnentschieden = hatErgebnis && props.heimTore === props.gastTore;
  const heimRolle: ErgebnisRolle | undefined = istUnentschieden ? "unentschieden" : hatErgebnis ? (props.heimTore! > props.gastTore! ? "gewinner" : "verlierer") : undefined;
  const gastRolle: ErgebnisRolle | undefined = istUnentschieden ? "unentschieden" : hatErgebnis ? (props.gastTore! > props.heimTore! ? "gewinner" : "verlierer") : undefined;
  const anpfiff = new Date(props.anpfiff);
  const abschnitt = formatiereAbschnittName(props.gruppe);
  const kalenderHref = baueGoogleKalenderUrl({
    titel: `${props.heimTeam} gegen ${props.gastTeam}`,
    start: anpfiff,
    dauerMinuten: 120,
    details: `WM 2026: ${props.heimTeam} gegen ${props.gastTeam}`,
    ort: props.stadion
  });

  return (
    <article className="glas-karte flex flex-col gap-4 rounded-[1.35rem] p-4 text-white sm:gap-5 sm:rounded-[1.75rem] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/85">
          <span>{abschnitt}</span>
          {props.stadion ? (
            <>
              <span aria-hidden="true">{"\u2022"}</span>
              <span className="max-w-[16rem] truncate">{props.stadion}</span>
            </>
          ) : null}
        </div>
        {istLive ? <LiveBadge /> : <span className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-sm font-semibold text-white/75">{formatiereLiveStatus(props.status, props.minute)}</span>}
      </div>

      <div className="grid grid-cols-1 items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/8 px-3 py-3 backdrop-blur-sm sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:rounded-[1.5rem] sm:px-4 sm:py-4">
        <div className="relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl px-2 py-2">
          <ErgebnisGlanz rolle={heimRolle} seite="links" />
          <div className="relative z-10">
            <FlaggenSymbol wert={props.heimFlagge} name={props.heimTeam} />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="flex items-center gap-2 text-lg font-black leading-tight text-white sm:text-2xl">
              <span className="truncate">{props.heimTeam}</span>
              {heimFavorit ? <span className="shrink-0 text-base text-[#b7f200]" title="Favorit">{"\u2665"}</span> : null}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-center sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          {istBeendet ? (
            <div className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              {props.heimTore ?? "-"}:{props.gastTore ?? "-"}
            </div>
          ) : (
            <div className="text-xl font-black tracking-tight text-white/90 sm:text-3xl">gegen</div>
          )}
          {istLive && props.minute ? <p className="mt-1 text-sm font-semibold text-[#ff92a1]">{props.minute}. Minute</p> : null}
        </div>

        <div className="relative flex min-w-0 justify-end gap-3 overflow-hidden rounded-2xl px-2 py-2 text-right">
          <ErgebnisGlanz rolle={gastRolle} seite="rechts" />
          <div className="relative z-10 min-w-0">
            <p className="flex items-center justify-end gap-2 text-lg font-black leading-tight text-white sm:text-2xl">
              {gastFavorit ? <span className="shrink-0 text-base text-[#b7f200]" title="Favorit">{"\u2665"}</span> : null}
              <span className="truncate">{props.gastTeam}</span>
            </p>
          </div>
          <div className="relative z-10">
            <FlaggenSymbol wert={props.gastFlagge} name={props.gastTeam} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 border-t border-white/10 pt-4 text-base text-white/80 sm:flex-row sm:items-center">
        <p className="text-sm font-semibold tracking-wide">Anpfiff {formatiereDatumZeit(anpfiff)} Uhr</p>
        <a href={kalenderHref} target="_blank" rel="noreferrer" className="wm-aktionsbutton inline-flex justify-center rounded-full px-4 py-3 text-sm font-black">
          In Google Kalender
        </a>
      </div>
    </article>
  );
}
