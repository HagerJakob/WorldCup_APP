"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-red-900">
      <h2 className="text-3xl font-black">Etwas ist schiefgelaufen.</h2>
      <p className="mt-2 text-lg">Die App konnte die Daten gerade nicht anzeigen. Bitte erneut versuchen.</p>
      <button type="button" onClick={reset} className="mt-4 min-h-11 rounded-full bg-[var(--farb-primary)] px-5 py-3 text-base font-bold text-white">
        Noch einmal laden
      </button>
    </div>
  );
}
