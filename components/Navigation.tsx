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
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur md:static md:border-0 md:bg-transparent md:px-0 md:py-0">
      <div className="grid grid-cols-4 gap-2 md:flex md:flex-col md:gap-3">
        {navigation.map((eintrag) => {
          const aktiv = pfad === eintrag.href || (eintrag.href !== "/" && pfad.startsWith(eintrag.href));

          return (
            <Link
              key={eintrag.href}
              href={eintrag.href}
              className={`flex min-h-11 flex-col items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-semibold transition md:flex-row md:justify-start md:gap-3 md:px-4 md:text-base ${
                aktiv
                  ? "bg-[var(--farb-primary)] text-white shadow-lg shadow-[rgba(26,58,107,0.18)]"
                  : "bg-[var(--farb-karton)] text-slate-700 hover:bg-slate-200"
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
