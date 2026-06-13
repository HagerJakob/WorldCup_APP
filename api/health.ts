import type { ServerResponse } from "node:http";

export default function handler(_request: unknown, response: ServerResponse) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(
    JSON.stringify({
      ok: true,
      zeit: new Date().toISOString(),
      hatApiKey: Boolean(process.env.FOOTBALL_DATA_API_KEY)
    })
  );
}
