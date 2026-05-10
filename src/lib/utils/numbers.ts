export function isNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function pickNumber(
  o: Record<string, unknown>,
  key: string
): number | null {
  const v = o[key];
  return isNumber(v) ? v : null;
}
