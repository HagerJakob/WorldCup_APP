import { NavLink } from "react-router-dom";

const navigation = [
  { href: "/", label: "Start" },
  { href: "/spielplan", label: "Spielplan" },
  { href: "/tabelle", label: "Tabelle" },
  { href: "/ko-runden", label: "KO-Runden" },
  { href: "/favoriten", label: "Favoriten" },
  { href: "/einstellungen", label: "Einstellungen" }
];

export function Navigation() {
  return (
    <nav className="w-full" aria-label="Hauptnavigation">
      <div className="flex snap-x gap-1.5 overflow-x-auto rounded-full border border-white/20 bg-white/8 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl scrollbar-hide sm:gap-2 sm:p-2">
        {navigation.map((eintrag) => (
          <NavLink
            key={eintrag.href}
            to={eintrag.href}
            end={eintrag.href === "/"}
            className={({ isActive }) =>
              `flex min-h-11 shrink-0 snap-start items-center justify-center rounded-full px-3 py-2.5 text-sm font-bold transition sm:min-h-12 sm:px-5 sm:py-3 sm:text-base ${
                isActive ? "wm-aktionsbutton" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {eintrag.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
