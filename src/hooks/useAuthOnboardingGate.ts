import { router, type Href, useSegments } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useAuthTokenStore } from '@/stores/auth-token-store';

type AuthGateOptions = {
  /** Route to send users to when no auth token is present. */
  onboardingPath?: Href;
  /** Route to send users to when they have a token but are on onboarding routes. */
  authedHomePath?: Href;
};

/**
 * Auth gate that:
 * - waits for Zustand persist hydration
 * - redirects to onboarding when no token
 * - redirects away from onboarding when token exists
 */
export function useAuthOnboardingGate(options?: AuthGateOptions) {
  const onboardingPath = (options?.onboardingPath ??
    '/screens/(onboarding)/welcome') as Href;
  const authedHomePath = (options?.authedHomePath ?? '/screens/main') as Href;

  // Some expo-router type setups infer `never[]` here; normalize to strings for runtime checks.
  const segments = useSegments() as string[];
  const token = useAuthTokenStore((s) => s.token);
  const [hydrated, setHydrated] = useState(
    () => useAuthTokenStore.persist.hasHydrated?.() ?? false
  );

  const isOnboardingRoute = useMemo(() => {
    // expo-router segments example: ['screens', '(onboarding)', 'welcome']
    return segments.includes('(onboarding)');
  }, [segments]);

  useEffect(() => {
    // Ensure persisted auth is loaded before routing decisions.
    // `onFinishHydration` fires immediately if already hydrated.
    const unsub = useAuthTokenStore.persist.onFinishHydration?.(() => {
      setHydrated(true);
    });
    useAuthTokenStore.persist.rehydrate?.();
    return () => {
      unsub?.();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const isAuthed = token !== null && token !== '';

    if (!isAuthed && !isOnboardingRoute) {
      router.replace(onboardingPath);
      return;
    }

    if (isAuthed && isOnboardingRoute) {
      router.replace(authedHomePath);
    }
  }, [hydrated, token, isOnboardingRoute, onboardingPath, authedHomePath]);

  return { hydrated, token };
}

