/** "03:47" — zero-padded HH:MM. */
export function formatTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** "03.47" — dot variant for the strip readout. */
export function formatStripTime(d: Date): string {
  return formatTime(d).replace(':', '.');
}

/** Each of "0", "3", "4", "7" — used by the 7-segment renderer. */
export function timeDigits(d: Date): [string, string, string, string] {
  const t = formatTime(d);
  return [t[0], t[1], t[3], t[4]];
}
