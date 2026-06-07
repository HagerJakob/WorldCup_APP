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
    return <Image src={wert} alt={name} width={34} height={24} className="h-6 w-9 rounded-md object-cover" unoptimized />;
  }

  return <span className="text-3xl" aria-hidden="true">{wert}</span>;
}

export function SpielKarte(props: SpielKarteProps) {
  const istLive = props.status === "IN_PLAY" || props.status === "PAUSED";
  const istBeendet = props.status === "FINISHED";
  const anpfiff = new Date(props.anpfiff);

  return (
    <article className="scharf-karte flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--farb-karton)] px-3 py-2 text-sm font-bold text-slate-700">
          <span>{props.gruppe}</span>
          <span aria-hidden="true">•</span>
          <span>{formatiereZeit(anpfiff)}</span>
        </div>
        {istLive ? <LiveBadge /> : <span className="text-sm font-semibold text-slate-500">{formatiereLiveStatus(props.status, props.minute)}</span>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <FlaggenSymbol wert={props.heimFlagge} name={props.heimTeam} />
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">{props.heimTeam}</p>
            <p className="text-sm font-medium text-slate-600">Heimteam</p>
          </div>
        </div>

        <div className="text-center">
          {istBeendet ? (
            <div className="text-3xl font-black tracking-tight text-[var(--farb-primary)] sm:text-4xl">
              {props.heimTore ?? "-"}:{props.gastTore ?? "-"}
            </div>
          ) : (
            <div className="text-2xl font-black tracking-tight text-[var(--farb-primary)] sm:text-3xl">VS</div>
          )}
          {istLive && props.minute ? <p className="mt-1 text-sm font-semibold text-[var(--farb-akzent)]">{props.minute}. Minute</p> : null}
        </div>

        <div className="flex min-w-0 justify-end gap-3 text-right">
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">{props.gastTeam}</p>
            <p className="text-sm font-medium text-slate-600">Gastteam</p>
          </div>
          <FlaggenSymbol wert={props.gastFlagge} name={props.gastTeam} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-base text-slate-700">
        <div>
          <p className="font-semibold text-slate-900">{props.stadion}</p>
          <p>{formatiereZeit(anpfiff)} Uhr, Mitteleuropäische Zeit</p>
        </div>
        {props.kalenderHref ? (
          <Link href={props.kalenderHref} className="rounded-full bg-[var(--farb-primary)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--farb-primary-dunkel)]">
            Zum Kalender
          </Link>
        ) : null}
      </div>
    </article>
  );
}
