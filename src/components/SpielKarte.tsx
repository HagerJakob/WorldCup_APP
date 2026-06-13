import { formatiereAbschnittName, formatiereDatumZeit, formatiereLiveStatus } from "../format";
import { baueGoogleKalenderUrl } from "../kalender";
import type { Spielstatus } from "../types";
import { LiveBadge } from "./LiveBadge";

export interface SpielKarteProps {
  heimTeam: string;
  gastTeam: string;
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
  if (wert.startsWith("http://") || wert.startsWith("https://")) {
    return <img src={wert} alt={name} className="h-12 w-16 rounded-xl border border-white/40 object-cover shadow-sm" loading="lazy" />;
  }

  return (
    <span className="text-4xl sm:text-5xl" aria-hidden="true">
      {wert}
    </span>
  );
}

type ErgebnisRolle = "gewinner" | "verlierer";

function ErgebnisGlanz({ rolle, seite }: { rolle?: ErgebnisRolle; seite: "links" | "rechts" }) {
  if (!rolle) return null;

  const farbe = rolle === "gewinner" ? "rgba(34, 197, 94, 0.78)" : "rgba(239, 68, 68, 0.78)";
  const weicheFarbe = rolle === "gewinner" ? "rgba(34, 197, 94, 0.18)" : "rgba(239, 68, 68, 0.18)";
  const position = seite === "links" ? "left-[-1.8rem]" : "right-[-1.8rem]";

  return (
    <span className={`pointer-events-none absolute top-[-1.8rem] h-24 w-24 rounded-full blur-[2px] ${position}`} aria-hidden="true" style={{ background: `radial-gradient(circle at center, ${farbe} 0%, ${weicheFarbe} 45%, transparent 72%)` }}>
      <span className="absolute left-7 top-7 h-5 w-12 rotate-[-35deg] rounded-full bg-white/45 blur-[1px]" />
    </span>
  );
}

export function SpielKarte(props: SpielKarteProps) {
  const istLive = props.status === "IN_PLAY" || props.status === "PAUSED";
  const istBeendet = props.status === "FINISHED";
  const hatEntschiedenesErgebnis = istBeendet && typeof props.heimTore === "number" && typeof props.gastTore === "number" && props.heimTore !== props.gastTore;
  const heimRolle: ErgebnisRolle | undefined = hatEntschiedenesErgebnis ? (props.heimTore! > props.gastTore! ? "gewinner" : "verlierer") : undefined;
  const gastRolle: ErgebnisRolle | undefined = hatEntschiedenesErgebnis ? (props.gastTore! > props.heimTore! ? "gewinner" : "verlierer") : undefined;
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
    <article className="glas-karte flex flex-col gap-5 rounded-[1.75rem] p-5 text-white sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/85">
          <span>{abschnitt}</span>
          <span aria-hidden="true">•</span>
          <span>{formatiereDatumZeit(anpfiff)} Uhr</span>
        </div>
        {istLive ? <LiveBadge /> : <span className="text-sm font-semibold text-white/75">{formatiereLiveStatus(props.status, props.minute)}</span>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
        <div className="relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl px-2 py-2">
          <ErgebnisGlanz rolle={heimRolle} seite="links" />
          <div className="relative z-10">
            <FlaggenSymbol wert={props.heimFlagge} name={props.heimTeam} />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-xl font-black leading-tight text-white sm:text-2xl">{props.heimTeam}</p>
            <p className="text-sm font-semibold text-white/75">Heimteam</p>
          </div>
        </div>

        <div className="text-center">
          {istBeendet ? (
            <div className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {props.heimTore ?? "-"}:{props.gastTore ?? "-"}
            </div>
          ) : (
            <div className="text-2xl font-black tracking-tight text-white/90 sm:text-3xl">gegen</div>
          )}
          {istLive && props.minute ? <p className="mt-1 text-sm font-semibold text-[#ff92a1]">{props.minute}. Minute</p> : null}
        </div>

        <div className="relative flex min-w-0 justify-end gap-3 overflow-hidden rounded-2xl px-2 py-2 text-right">
          <ErgebnisGlanz rolle={gastRolle} seite="rechts" />
          <div className="relative z-10 min-w-0">
            <p className="text-xl font-black leading-tight text-white sm:text-2xl">{props.gastTeam}</p>
            <p className="text-sm font-semibold text-white/75">Gastteam</p>
          </div>
          <div className="relative z-10">
            <FlaggenSymbol wert={props.gastFlagge} name={props.gastTeam} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-base text-white/80">
        <p className="text-sm font-semibold tracking-wide">Anpfiff {formatiereDatumZeit(anpfiff)} Uhr</p>
        <a href={kalenderHref} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-3 text-sm font-black text-[var(--farb-primary)] transition hover:bg-slate-100">
          In Google Kalender
        </a>
      </div>
    </article>
  );
}
