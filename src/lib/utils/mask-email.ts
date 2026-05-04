/**
 * Masks the local part for list display (first character + bullets); keeps @domain
 * so the row is still recognizable.
 */
export function maskEmailForListDisplay(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return '—';

  const at = trimmed.indexOf('@');
  if (at <= 0 || at >= trimmed.length - 1) {
    if (trimmed.length <= 4) return '••••';
    return `${'•'.repeat(trimmed.length - 4)}${trimmed.slice(-4)}`;
  }

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const first = local[0] ?? '•';
  const restLen = Math.max(3, local.length - 1);
  return `${first}${'•'.repeat(restLen)}@${domain}`;
}
