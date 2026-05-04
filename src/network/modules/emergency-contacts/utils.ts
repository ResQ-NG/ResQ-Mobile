import type { EmergencyContact as ApiEmergencyContact } from './types';
import { maskPhoneDigits } from '@/lib/utils/mask-phone';
import { maskEmailForListDisplay } from '@/lib/utils/mask-email';
import {
  formatNgMobileDisplayForInput,
  nationalFromStoredPhone,
  normalizeNgNationalFromInput,
} from '@/hooks/useGetStartedContact';

/** Normalized emergency contact for Watch Me / SOS UI (backed by API). */
export type UiEmergencyContact = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  avatarUrl: string | null;
  relationshipLabel?: string;
  /** From `relationship.id` when API includes relationship. */
  relationshipId?: number | null;
  isAppUser: boolean;
};

/** Prefill the shared email/phone field when editing an emergency contact. */
export function emergencyContactIdentifierPrefill(
  c: Pick<UiEmergencyContact, 'phone' | 'email'>
): string {
  const p = c.phone?.trim() ?? '';
  let national = nationalFromStoredPhone(p);
  if (national.length === 0 && p.replace(/\D/g, '').length > 0) {
    national = normalizeNgNationalFromInput(p);
  }
  if (national.length > 0) {
    return formatNgMobileDisplayForInput(national);
  }
  return c.email?.trim() ?? '';
}

/** Subtitle line: masked phone when enough digits, otherwise email, otherwise masked short phone. */
export function formatEmergencyContactReachabilityLine(
  c: Pick<UiEmergencyContact, 'phone' | 'email'>
): string {
  const raw = c.phone?.trim() ?? '';
  const digitCount = raw.replace(/\D/g, '').length;
  if (digitCount >= 4) return maskPhoneDigits(raw);
  const e = c.email?.trim();
  if (e) return maskEmailForListDisplay(e);
  if (raw.length > 0) return maskPhoneDigits(raw);
  return '—';
}

/** Invite sheet payload: prefer phone when enough digits, else email. */
export function inviteReachabilityPayloadFromUiContact(
  c: Pick<UiEmergencyContact, 'phone' | 'email'>
): string {
  const digits = c.phone.replace(/\D/g, '');
  if (digits.length >= 4) return c.phone;
  return c.email?.trim() ?? '';
}

export function mapApiEmergencyContactToUi(
  c: ApiEmergencyContact
): UiEmergencyContact {
  const url = c.avatar_url?.trim();
  const phone = (c.phone_number ?? '').trim();
  const email = c.email?.trim() ? c.email.trim() : null;
  return {
    id: String(c.id),
    name: c.full_name,
    phone,
    email,
    avatarUrl: url && url.length > 0 ? url : null,
    relationshipLabel: c.relationship?.name,
    relationshipId: c.relationship?.id ?? null,
    isAppUser: c.is_app_user,
  };
}
