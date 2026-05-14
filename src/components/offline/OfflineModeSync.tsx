import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineModeStore } from '@/stores/offline-mode-store';

/**
 * Keeps {@link useOfflineModeStore} in sync with device connectivity.
 * Mount once near the app root (e.g. next to {@link setupOnlineManager}).
 */
export function OfflineModeSync() {
  const setOffline = useOfflineModeStore((s) => s.setOffline);

  useEffect(() => {
    let cancelled = false;

    void NetInfo.fetch().then((state) => {
      if (!cancelled) {
        setOffline(state.isConnected === false);
      }
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(state.isConnected === false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [setOffline]);

  return null;
}
