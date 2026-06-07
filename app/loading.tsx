import { LadePlatzhalter } from "@/components/LadePlatzhalter";

export default function Laden() {
  return (
    <div className="space-y-6">
      <div className="h-28 rounded-[1.75rem] border border-slate-200 bg-slate-100/70" />
      <div className="grid gap-6 lg:grid-cols-2">
        <LadePlatzhalter zeilen={2} />
        <LadePlatzhalter zeilen={2} />
      </div>
    </div>
  );
}
