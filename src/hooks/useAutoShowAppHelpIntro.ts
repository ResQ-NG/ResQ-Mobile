import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAppHelpIntroStore } from '@/stores/app-help-intro-store';

/**
 * After persisted state hydrates, opens the multi-slide help modal once for users who have not seen it yet.
 */
export function useAutoShowAppHelpIntro() {
  const hasCompleted = useAppHelpIntroStore((s) => s.hasCompletedAppHelpIntro);
  const [hydrated, setHydrated] = useState(
    () => useAppHelpIntroStore.persist.hasHydrated?.() ?? false
  );

  useEffect(() => {
    const unsub = useAppHelpIntroStore.persist.onFinishHydration?.(() => {
      setHydrated(true);
    });
    useAppHelpIntroStore.persist.rehydrate?.();
    return () => {
      unsub?.();
    };
  }, []);

  useEffect(() => {
    if (!hydrated || hasCompleted) return;
    const id = requestAnimationFrame(() => {
      router.push('/(modals)/how-to-use-app');
    });
    return () => cancelAnimationFrame(id);
  }, [hydrated, hasCompleted]);
}
