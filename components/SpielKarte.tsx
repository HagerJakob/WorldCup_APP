import Image from "next/image";
import Link from "next/link";
import type { Spielstatus } from "@/lib/types";
import { formatiereLiveStatus, formatiereZeit } from "@/lib/api";
import { LiveBadge } from "@/components/LiveBadge";

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
  kalenderHref?: string;
}

function FlaggenSymbol({ wert, name }: { wert: string; name: string }) {
  if (wert.startsWith("http://") || wert.startsWith("https://")) {
    return <Image src={wert} alt={name} width={64} height={48} className="h-12 w-16 rounded-xl border border-white/40 object-cover shadow-sm" unoptimized />;
  }

  return <span className="text-4xl sm:text-5xl" aria-hidden="true">{wert}</span>;
}

export function SpielKarte(props: SpielKarteProps) {
  const istLive = props.status === "IN_PLAY" || props.status === "PAUSED";
  const istBeendet = props.status === "FINISHED";
  const anpfiff = new Date(props.anpfiff);

  return (
    <article className="glas-karte flex flex-col gap-5 rounded-[1.75rem] p-5 text-white sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/85">
          <span>{props.gruppe}</span>
          <span aria-hidden="true">•</span>
          <span>{formatiereZeit(anpfiff)}</span>
        </div>
        {istLive ? <LiveBadge /> : <span className="text-sm font-semibold text-white/75">{formatiereLiveStatus(props.status, props.minute)}</span>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-3">
          <FlaggenSymbol wert={props.heimFlagge} name={props.heimTeam} />
          <div className="min-w-0">
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
            <div className="text-2xl font-black tracking-tight text-white/90 sm:text-3xl">VS</div>
          )}
          {istLive && props.minute ? <p className="mt-1 text-sm font-semibold text-[#ff92a1]">{props.minute}. Minute</p> : null}
        </div>

        <div className="flex min-w-0 justify-end gap-3 text-right">
          <div className="min-w-0">
            <p className="text-xl font-black leading-tight text-white sm:text-2xl">{props.gastTeam}</p>
            <p className="text-sm font-semibold text-white/75">Gastteam</p>
          </div>
          <FlaggenSymbol wert={props.gastFlagge} name={props.gastTeam} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-base text-white/80">
        <div>
          <p className="text-sm font-semibold tracking-wide">Anpfiff {formatiereZeit(anpfiff)} Uhr, Mitteleuropäische Zeit</p>
        </div>
        {props.kalenderHref ? (
          <Link href={props.kalenderHref} className="rounded-full bg-white px-4 py-3 text-sm font-black text-[var(--farb-primary)] transition hover:bg-slate-100">
            Zum Kalender
          </Link>
        ) : null}
      </div>
    </article>
  );
}
