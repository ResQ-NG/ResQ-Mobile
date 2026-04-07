import { useCallback, useMemo, useState } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';

export const GET_STARTED_NG_CC = '234';
export const GET_STARTED_NG_E164_PREFIX = `+${GET_STARTED_NG_CC}`;
/** Display: +234-… */
export const GET_STARTED_NG_E164_PREFIX_DASH = `${GET_STARTED_NG_E164_PREFIX}-`;

export type GetStartedContactMode = 'neutral' | 'email' | 'phone';

export type GetStartedLeftIconVariant = 'mail' | 'ng-flag';

function normalizeNgNationalFromInput(text: string): string {
  let digits = text.replace(/\D/g, '');
  if (digits.startsWith(GET_STARTED_NG_CC)) {
    digits = digits.slice(GET_STARTED_NG_CC.length);
  }
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function formatPhoneDisplay(nationalDigits: string): string {
  return `${GET_STARTED_NG_E164_PREFIX_DASH}${nationalDigits}`;
}

function detectContactMode(value: string): GetStartedContactMode {
  const t = value.trimStart();
  if (t.length === 0) return 'neutral';
  if (t.includes('@') || /[a-zA-Z]/.test(t)) return 'email';
  if (!/^\+?[\d\s-]*$/.test(t)) return 'email';

  const d = t.replace(/\D/g, '');
  if (d.length === 0) return 'neutral';
  if (GET_STARTED_NG_CC.startsWith(d) && d.length < GET_STARTED_NG_CC.length) {
    return 'neutral';
  }
  if (d === GET_STARTED_NG_CC) return 'neutral';

  const nationalDigits = normalizeNgNationalFromInput(t);
  if (nationalDigits.length === 0) return 'neutral';

  return 'phone';
}

function nationalFromStoredPhone(stored: string): string {
  if (stored.startsWith(GET_STARTED_NG_E164_PREFIX_DASH)) {
    return stored
      .slice(GET_STARTED_NG_E164_PREFIX_DASH.length)
      .replace(/\D/g, '')
      .slice(0, 10);
  }
  if (stored.startsWith(GET_STARTED_NG_E164_PREFIX)) {
    return stored
      .slice(GET_STARTED_NG_E164_PREFIX.length)
      .replace(/\D/g, '')
      .slice(0, 10);
  }
  return '';
}

export function isValidGetStartedEmail(email: string): boolean {
  const t = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

export function isValidNgMobileNational(national: string): boolean {
  return national.length === 10 && /^[789]/.test(national);
}

function stripLeadingNgPrefixForEmail(text: string): string {
  const t = text.trimStart();
  if (t.startsWith(GET_STARTED_NG_E164_PREFIX_DASH)) {
    return t.slice(GET_STARTED_NG_E164_PREFIX_DASH.length).trimStart();
  }
  if (t.startsWith(GET_STARTED_NG_E164_PREFIX)) {
    return t.slice(GET_STARTED_NG_E164_PREFIX.length).trimStart();
  }
  if (t.startsWith(GET_STARTED_NG_CC)) {
    const rest = t.slice(GET_STARTED_NG_CC.length);
    if (rest.length === 0 || /[@a-zA-Z]/.test(rest.charAt(0))) {
      return rest.trimStart();
    }
  }
  return t;
}

export function useGetStartedContact() {
  const [contact, setContact] = useState('');

  const mode = useMemo(
    () => detectContactMode(contact),
    [contact]
  );

  const national = useMemo(
    () => (mode === 'phone' ? nationalFromStoredPhone(contact) : ''),
    [contact, mode]
  );

  const canContinue = useMemo(() => {
    if (mode === 'phone') return isValidNgMobileNational(national);
    if (mode === 'email') return isValidGetStartedEmail(contact);
    return false;
  }, [contact, mode, national]);

  const handleContactChange = useCallback((text: string) => {
    const nextMode = detectContactMode(text);

    if (nextMode === 'phone') {
      const nationalDigits = normalizeNgNationalFromInput(text);
      setContact(formatPhoneDisplay(nationalDigits));
      return;
    }

    if (nextMode === 'neutral') {
      const d = text.replace(/\D/g, '');
      if (d === GET_STARTED_NG_CC) {
        setContact('');
        return;
      }
      setContact(text);
      return;
    }

    setContact(stripLeadingNgPrefixForEmail(text));
  }, []);

  const showPhoneHint =
    mode === 'phone' &&
    national.length > 0 &&
    !isValidNgMobileNational(national);

  const isPhoneMode = mode === 'phone';

  const keyboardType: KeyboardTypeOptions = isPhoneMode
    ? 'phone-pad'
    : 'email-address';

  const textContentType: TextInputProps['textContentType'] = isPhoneMode
    ? 'telephoneNumber'
    : 'emailAddress';

  const fieldLabel = isPhoneMode ? 'Phone number' : 'Email or phone';
  const placeholder = isPhoneMode ? '8012345678' : 'you@example.com';

  const leftIconVariant: GetStartedLeftIconVariant = isPhoneMode
    ? 'ng-flag'
    : 'mail';

  const submitInvalidMessage = useMemo(() => {
    if (canContinue) return null;
    if (mode === 'phone') {
      return 'Enter a valid Nigerian mobile number (10 digits after +234-).';
    }
    if (mode === 'email') {
      return 'Enter a valid email address.';
    }
    return 'Please enter your email or a Nigerian phone number.';
  }, [canContinue, mode]);

  return {
    contact,
    handleContactChange,
    mode,
    national,
    canContinue,
    showPhoneHint,
    keyboardType,
    textContentType,
    fieldLabel,
    placeholder,
    leftIconVariant,
    submitInvalidMessage,
  };
}
