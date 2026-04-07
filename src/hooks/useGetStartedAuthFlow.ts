import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import type {
  CheckIdentifierRequest,
  CreateAccountRequest,
  LoginWithIdentifierRequest,
} from '@/network/modules/auth/types';
import {
  useCheckIdentifier,
  useCreateAccount,
  useLoginWithIdentifier,
  useVerifyIdentifierOtp,
} from '@/network/modules/auth/queries';
import { useAuthTokenStore } from '@/stores/auth-token-store';
import { showToast } from '@/lib/utils/app-toast';
import {
  isValidGetStartedEmail,
  isValidNgMobileNational,
  useGetStartedContact,
} from '@/hooks/useGetStartedContact';

export type GetStartedAuthPhase =
  | 'identifier'
  | 'active_password'
  | 'signup'
  | 'verify_otp';

const MIN_PASSWORD_LEN = 6;
const OTP_LEN = 6;

function pickAuthTokenFromAuthResponse(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  for (const key of ['token', 'accessToken', 'access_token'] as const) {
    const v = o[key];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return null;
}

function buildCheckPayload(
  contact: string,
  mode: ReturnType<typeof useGetStartedContact>['mode'],
  national: string
): CheckIdentifierRequest | null {
  if (mode === 'email' && isValidGetStartedEmail(contact)) {
    return { identifier: 'email', value: contact.trim() };
  }
  if (mode === 'phone' && isValidNgMobileNational(national)) {
    return { identifier: 'phone', value: `+234${national}` };
  }
  return null;
}

export function useGetStartedAuthFlow() {
  const contactApi = useGetStartedContact();
  const setToken = useAuthTokenStore((s) => s.setToken);

  const [phase, setPhase] = useState<GetStartedAuthPhase>('identifier');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [otp, setOtp] = useState('');

  const lockedPayloadRef = useRef<CheckIdentifierRequest | null>(null);

  const checkPayload = useMemo(
    () =>
      buildCheckPayload(
        contactApi.contact,
        contactApi.mode,
        contactApi.national
      ),
    [contactApi.contact, contactApi.mode, contactApi.national]
  );

  useEffect(() => {
    const locked = lockedPayloadRef.current;
    if (!locked || phase === 'identifier') return;
    const cur = checkPayload;
    if (
      !cur ||
      cur.identifier !== locked.identifier ||
      cur.value !== locked.value
    ) {
      lockedPayloadRef.current = null;
      setPhase('identifier');
      setPassword('');
      setFirstName('');
      setLastName('');
      setSignupPassword('');
      setOtp('');
    }
  }, [checkPayload, phase]);

  const finishWithSession = useCallback(
    (data: unknown, successMessage: string) => {
      const token = pickAuthTokenFromAuthResponse(data);
      if (token) {
        setToken(token);
        showToast({ message: successMessage, variant: 'success' });
        router.replace('/screens/main');
        return;
      }
      showToast({
        message: 'Signed in, but no session token was returned. Check the API response shape.',
        variant: 'error',
      });
    },
    [setToken]
  );

  const checkMutation = useCheckIdentifier({
    onSuccess: (data, variables) => {
      lockedPayloadRef.current = variables;
      if (data.status === 'active') {
        setPhase('active_password');
        setPassword('');
      } else if (data.status === 'not_found') {
        setPhase('signup');
        setFirstName('');
        setLastName('');
        setSignupPassword('');
      } else {
        setPhase('verify_otp');
        setOtp('');
      }
    },
  });

  const loginMutation = useLoginWithIdentifier({
    onSuccess: (data) => finishWithSession(data, 'Welcome back.'),
  });

  const createMutation = useCreateAccount({
    onSuccess: (data) => {
      const token = pickAuthTokenFromAuthResponse(data);
      if (token) {
        setToken(token);
        showToast({ message: 'Account created.', variant: 'success' });
        router.replace('/screens/main');
        return;
      }
      showToast({
        message: 'Account created. Sign in with your password.',
        variant: 'success',
      });
      setSignupPassword('');
      setPhase('active_password');
      setPassword('');
    },
  });

  const verifyMutation = useVerifyIdentifierOtp({
    onSuccess: (data) => finishWithSession(data, 'You’re verified. Welcome!'),
  });

  const goBackToIdentifier = useCallback(() => {
    lockedPayloadRef.current = null;
    setPhase('identifier');
    setPassword('');
    setFirstName('');
    setLastName('');
    setSignupPassword('');
    setOtp('');
  }, []);

  const submitCheckIdentifier = useCallback(() => {
    if (!checkPayload) {
      const msg = contactApi.submitInvalidMessage;
      if (msg) showToast({ message: msg, variant: 'error' });
      return;
    }
    checkMutation.mutate(checkPayload);
  }, [checkMutation, checkPayload, contactApi.submitInvalidMessage]);

  const submitLogin = useCallback(() => {
    const creds = lockedPayloadRef.current;
    if (!creds || password.length < MIN_PASSWORD_LEN) {
      showToast({
        message: `Enter your password (at least ${MIN_PASSWORD_LEN} characters).`,
        variant: 'error',
      });
      return;
    }
    const body: LoginWithIdentifierRequest = {
      identifier: creds.identifier,
      password,
    };
    if (creds.identifier === 'email') {
      body.email = creds.value;
    } else {
      body.phone_number = creds.value;
    }
    loginMutation.mutate(body);
  }, [loginMutation, password]);

  const submitSignup = useCallback(() => {
    const creds = lockedPayloadRef.current;
    if (!creds) return;
    const fn = firstName.trim();
    if (fn.length < 1) {
      showToast({ message: 'Enter your first name.', variant: 'error' });
      return;
    }
    if (signupPassword.length < MIN_PASSWORD_LEN) {
      showToast({
        message: `Choose a password (at least ${MIN_PASSWORD_LEN} characters).`,
        variant: 'error',
      });
      return;
    }
    const body: CreateAccountRequest = {
      first_name: fn,
      password: signupPassword,
    };
    const ln = lastName.trim();
    if (ln) body.last_name = ln;
    if (creds.identifier === 'email') {
      body.email = creds.value;
    } else {
      body.phone_number = creds.value;
    }
    createMutation.mutate(body);
  }, [createMutation, firstName, lastName, signupPassword]);

  const submitOtp = useCallback(() => {
    const creds = lockedPayloadRef.current;
    if (!creds) return;
    const code = otp.replace(/\D/g, '');
    if (code.length < OTP_LEN) {
      showToast({
        message: `Enter the ${OTP_LEN}-digit verification code.`,
        variant: 'error',
      });
      return;
    }
    verifyMutation.mutate({ ...creds, code });
  }, [otp, verifyMutation]);

  const primaryBusy =
    checkMutation.isPending ||
    loginMutation.isPending ||
    createMutation.isPending ||
    verifyMutation.isPending;

  const canPrimary = useMemo(() => {
    if (phase === 'identifier') {
      return contactApi.canContinue && !checkMutation.isPending;
    }
    if (phase === 'active_password') {
      return password.length >= MIN_PASSWORD_LEN && !loginMutation.isPending;
    }
    if (phase === 'signup') {
      return (
        firstName.trim().length >= 1 &&
        signupPassword.length >= MIN_PASSWORD_LEN &&
        !createMutation.isPending
      );
    }
    return (
      otp.replace(/\D/g, '').length >= OTP_LEN && !verifyMutation.isPending
    );
  }, [
    phase,
    contactApi.canContinue,
    checkMutation.isPending,
    password,
    loginMutation.isPending,
    firstName,
    signupPassword,
    createMutation.isPending,
    otp,
    verifyMutation.isPending,
  ]);

  const primaryLabel = useMemo(() => {
    if (phase === 'identifier') return 'Continue';
    if (phase === 'active_password') return 'Sign in';
    if (phase === 'signup') return 'Create account';
    return 'Verify';
  }, [phase]);

  const otpHint = useMemo(() => {
    if (contactApi.mode === 'phone') {
      return 'Enter the code we sent to your phone.';
    }
    return 'Enter the code we sent to your email.';
  }, [contactApi.mode]);

  return {
    ...contactApi,
    phase,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    signupPassword,
    setSignupPassword,
    otp,
    setOtp,
    primaryLabel,
    canPrimary,
    primaryBusy,
    otpHint,
    goBackToIdentifier,
    submitCheckIdentifier,
    submitLogin,
    submitSignup,
    submitOtp,
  };
}
