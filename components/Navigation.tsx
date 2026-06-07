"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/spielplan", label: "Spielplan" },
  { href: "/tabelle", label: "Tabelle" },
  { href: "/favoriten", label: "Favoriten" },
  { href: "/einstellungen", label: "Einstellungen" }
];

export function Navigation() {
  const pfad = usePathname();

  return (
    <nav className="w-full">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-white/20 bg-white/8 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl scrollbar-hide">
        {navigation.map((eintrag) => {
          const aktiv = pfad === eintrag.href || (eintrag.href !== "/" && pfad.startsWith(eintrag.href));

          return (
            <Link
              key={eintrag.href}
              href={eintrag.href}
              className={`flex min-h-12 shrink-0 items-center justify-center rounded-full px-4 py-3 text-sm font-bold transition sm:px-5 sm:text-base ${
                aktiv
                  ? "bg-white text-[var(--farb-primary)] shadow-[0_10px_30px_rgba(255,255,255,0.28)]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
              aria-current={aktiv ? "page" : undefined}
            >
              <span>{eintrag.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
