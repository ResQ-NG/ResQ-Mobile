import type { AuthUserProfile } from '@/network/modules/auth/types';
import { isPlainRecord } from '@/network/config/type-guards';

/** Unwraps `GET .../profile` whether the API returns the user flat or under `user`. */
export function normalizeProfileApiResponse(response: unknown): AuthUserProfile {
  if (!isPlainRecord(response)) {
    throw new Error('Invalid profile response');
  }
  const nested = response.user;
  if (isPlainRecord(nested) && typeof nested.email === 'string') {
    return nested as unknown as AuthUserProfile;
  }
  if (typeof response.email === 'string' && typeof response.first_name === 'string') {
    return response as unknown as AuthUserProfile;
  }
  throw new Error('Invalid profile response shape');
}

export type AuthProfileNameFields = Pick<
  AuthUserProfile,
  'first_name' | 'last_name' | 'email'
>;

export function formatAuthProfileDisplayName(profile: AuthProfileNameFields): string {
  const parts = [profile.first_name, profile.last_name]
    .map((s) => s?.trim())
    .filter(Boolean);
  if (parts.length > 0) return parts.join(' ');
  return profile.email;
}

export function formatAuthProfileMemberSinceLabel(createdAt: string): string {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return 'Member';
  return `Member since ${d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/** Masks all but the last four digits for list display. */
export function maskPhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '••••';
  return `${'•'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}

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
