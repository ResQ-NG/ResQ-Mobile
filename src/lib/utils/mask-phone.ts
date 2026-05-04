/** Masks all but the last four digits for list display. */
export function maskPhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '••••';
  return `${'•'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}
