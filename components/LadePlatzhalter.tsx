export function LadePlatzhalter({ zeilen = 3 }: { zeilen?: number }) {
  return (
    <div className="scharf-karte animate-pulse rounded-[1.5rem] border border-slate-200 p-5 sm:p-6">
      <div className="mb-5 h-4 w-36 rounded-full bg-slate-200" />
      <div className="space-y-4">
        {Array.from({ length: zeilen }).map((_, index) => (
          <div key={index} className="h-20 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
