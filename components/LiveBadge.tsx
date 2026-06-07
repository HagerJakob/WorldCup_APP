export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-sm font-bold text-[var(--farb-akzent)]">
      <span className="h-3 w-3 rounded-full bg-[var(--farb-akzent)] shadow-[0_0_0_6px_rgba(215,38,56,0.12)] motion-safe:animate-pulse" />
      LIVE
    </span>
  );
}
