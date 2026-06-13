function googleDatum(datum: Date) {
  return datum.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function baueGoogleKalenderUrl({
  titel,
  start,
  dauerMinuten = 120,
  details,
  ort
}: {
  titel: string;
  start: Date;
  dauerMinuten?: number;
  details?: string;
  ort?: string;
}) {
  const ende = new Date(start.getTime() + dauerMinuten * 60 * 1000);
  const parameter = new URLSearchParams({
    action: "TEMPLATE",
    text: titel,
    dates: `${googleDatum(start)}/${googleDatum(ende)}`,
    details: details ?? titel
  });

  if (ort) {
    parameter.set("location", ort);
  }

  return `https://calendar.google.com/calendar/render?${parameter.toString()}`;
}
