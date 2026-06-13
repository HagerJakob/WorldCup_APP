# Vercel Deployment

## Voraussetzungen

- Ein Vercel-Konto
- Das Projekt in einem GitHub-Repository
- Ein gueltiger `FOOTBALL_DATA_API_KEY`

## Vercel-Projekt anlegen

1. Auf https://vercel.com einloggen.
2. `Add New...` -> `Project` waehlen.
3. Das GitHub-Repository dieser App importieren.
4. Framework Preset: `Vite`
5. Build Command: `npm run build`
6. Output Directory: `dist`

Diese Werte sind auch in `vercel.json` hinterlegt.

## Environment Variable setzen

In Vercel unter `Project Settings` -> `Environment Variables`:

```text
FOOTBALL_DATA_API_KEY=dein_api_key
```

Fuer `Production`, `Preview` und `Development` aktivieren, wenn du alle Umgebungen testen willst.

## Deploy

Nach dem Import startet Vercel automatisch den ersten Deploy. Bei spaeteren Aenderungen reicht ein Push zu GitHub.

## Nach dem Deploy testen

- `/` oeffnet die Startseite.
- `/spielplan` funktioniert auch nach direktem Neuladen.
- `/api/spiele?bereich=alle` liefert JSON.
- `/api/standings` liefert JSON.
- Ein Kalender-Link in einer Spielkarte oeffnet eine `.ics` Datei.

## Lokal weiterentwickeln

```bash
npm run dev
bun run api
```

Vite leitet lokale `/api`-Requests weiterhin an `http://localhost:3001` weiter.
