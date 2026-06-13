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
    <nav className="w-full">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-white/20 bg-white/8 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl scrollbar-hide">
        {navigation.map((eintrag) => (
          <NavLink
            key={eintrag.href}
            to={eintrag.href}
            end={eintrag.href === "/"}
            className={({ isActive }) =>
              `flex min-h-12 shrink-0 items-center justify-center rounded-full px-4 py-3 text-sm font-bold transition sm:px-5 sm:text-base ${
                isActive ? "bg-white text-[var(--farb-primary)] shadow-[0_10px_30px_rgba(255,255,255,0.28)]" : "text-white/80 hover:bg-white/10 hover:text-white"
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
