import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import type {
  CheckIdentifierRequest,
  CreateAccountRequest,
  LoginWithIdentifierRequest,
  LoginWithIdentifierResponse,
  ResendVerificationTokenRequest,
  VerifyEmailRequest,
} from '@/network/modules/auth/types';
import {
  useCheckIdentifier,
  useCreateAccount,
  useLoginWithIdentifier,
  useResendVerificationToken,
  useVerifyEmail,
  useVerifyIdentifierOtp,
} from '@/network/modules/auth/queries';
import { getApiErrorMessage } from '@/network/config/api-client';
import {
  extractApiFieldErrorsFromThrown,
  fieldErrorsToPartialRecord,
} from '@/network/config/api-field-errors';
import { useAuthTokenStore } from '@/stores/auth-token-store';
import { clearHttpAuthInterceptorState } from '@/network/config/http-auth-interceptor-state';
import { AuthKeys } from '@/network/modules/auth/keys';
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

const MIN_LOGIN_PASSWORD_LEN = 6;
const MIN_SIGNUP_PASSWORD_LEN = 12;
const OTP_LEN = 6;
const RESEND_COOLDOWN_SEC = 30;

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
  const queryClient = useQueryClient();
  const contactApi = useGetStartedContact();
  const setToken = useAuthTokenStore((s) => s.setToken);
  const setRefreshToken = useAuthTokenStore((s) => s.setRefreshToken);
  const [phase, setPhase] = useState<GetStartedAuthPhase>('identifier');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCooldownSec, setResendCooldownSec] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [signupFieldErrors, setSignupFieldErrors] = useState<
    Record<string, string>
  >({});

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
      setResendCooldownSec(0);
      setRememberMe(false);
    }
  }, [checkPayload, phase]);

  useEffect(() => {
    if (phase !== 'signup') setSignupFieldErrors({});
  }, [phase]);

  useEffect(() => {
    if (phase !== 'signup') return;
    setSignupFieldErrors({});
  }, [phase, firstName, lastName, signupPassword, contactApi.contact]);

  const finishWithSession = useCallback(
    (data: LoginWithIdentifierResponse) => {
      clearHttpAuthInterceptorState();
      const { token, refresh_token: refreshToken } = data;
      setToken(token);
      setRefreshToken(rememberMe ? (refreshToken ?? null) : null);
      void queryClient.invalidateQueries({ queryKey: [AuthKeys.UserProfile] });
      router.replace('/screens/main');
    },
    [queryClient, rememberMe, setToken, setRefreshToken]
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
        setResendCooldownSec(0);
      }
    },
  });

  const loginMutation = useLoginWithIdentifier({
    onSuccess: (data) => finishWithSession(data),
  });

  const createMutation = useCreateAccount({
    onError: (err) => {
      const items = extractApiFieldErrorsFromThrown(err);
      if (items.length > 0) {
        setSignupFieldErrors(fieldErrorsToPartialRecord(items));
        return;
      }
      showToast({
        message: getApiErrorMessage(err),
        variant: 'error',
      });
    },
    onSuccess: () => {
      setSignupFieldErrors({});
      setSignupPassword('');
      setOtp('');
      setPhase('verify_otp');
      setResendCooldownSec(RESEND_COOLDOWN_SEC);
      showToast({
        message: 'Account created. Enter the verification code we sent you.',
        variant: 'success',
      });
    },
  });

  const verifyMutation = useVerifyIdentifierOtp({
    onSuccess: (data) => finishWithSession(data),
  });

  const verifyEmailMutation = useVerifyEmail({
    onSuccess: (data) => finishWithSession(data),
  });

  const resendVerificationTokenMutation = useResendVerificationToken({
    onSuccess: () => {
      setResendCooldownSec(RESEND_COOLDOWN_SEC);
      showToast({ message: 'Verification code resent.', variant: 'success' });
    },
  });

  useEffect(() => {
    if (phase !== 'verify_otp') return;
    if (resendCooldownSec <= 0) return;
    const id = setInterval(() => {
      setResendCooldownSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, resendCooldownSec]);

  const goBackToIdentifier = useCallback(() => {
    lockedPayloadRef.current = null;
    setPhase('identifier');
    setPassword('');
    setFirstName('');
    setLastName('');
    setSignupPassword('');
    setOtp('');
    setResendCooldownSec(0);
    setRememberMe(false);
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
    if (!creds || password.length < MIN_LOGIN_PASSWORD_LEN) {
      showToast({
        message: `Enter your password (at least ${MIN_LOGIN_PASSWORD_LEN} characters).`,
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
    if (signupPassword.length < MIN_SIGNUP_PASSWORD_LEN) {
      showToast({
        message: `Choose a password (at least ${MIN_SIGNUP_PASSWORD_LEN} characters).`,
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
    if (creds.identifier === 'email') {
      const body: VerifyEmailRequest = { email: creds.value, code };
      verifyEmailMutation.mutate(body);
      return;
    }
    verifyMutation.mutate({ ...creds, code });
  }, [otp, verifyEmailMutation, verifyMutation]);

  const submitResendOtp = useCallback(() => {
    const creds = lockedPayloadRef.current;
    if (!creds) return;
    if (resendCooldownSec > 0) return;
    if (creds.identifier === 'email') {
      const body: ResendVerificationTokenRequest = { email: creds.value };
      resendVerificationTokenMutation.mutate(body);
      return;
    }
    // TODO: Add phone resend endpoint when backend supports it.
    showToast({
      message:
        'Resend for phone is not available yet. Try again in a moment or use a different phone number.',
      variant: 'default',
    });
  }, [resendCooldownSec, resendVerificationTokenMutation]);

  const primaryBusy =
    checkMutation.isPending ||
    loginMutation.isPending ||
    createMutation.isPending ||
    verifyMutation.isPending ||
    verifyEmailMutation.isPending ||
    resendVerificationTokenMutation.isPending;

  const canPrimary = useMemo(() => {
    if (phase === 'identifier') {
      return contactApi.canContinue && !checkMutation.isPending;
    }
    if (phase === 'active_password') {
      return (
        password.length >= MIN_LOGIN_PASSWORD_LEN && !loginMutation.isPending
      );
    }
    if (phase === 'signup') {
      return (
        firstName.trim().length >= 1 &&
        signupPassword.length >= MIN_SIGNUP_PASSWORD_LEN &&
        !createMutation.isPending
      );
    }
    return (
      otp.replace(/\D/g, '').length >= OTP_LEN &&
      !verifyMutation.isPending &&
      !verifyEmailMutation.isPending
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
    verifyEmailMutation.isPending,
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
    submitResendOtp,
    resendCooldownSec,
    signupFieldErrors,
    rememberMe,
    setRememberMe,
  };
}
