import { useEffect, useRef } from 'react';
import { useLocationStore } from '@/stores/location-store';
import { useUserLocationStore } from '@/stores/user-location-store';

/**
 * Keeps {@link useUserLocationStore} updated (GPS + reverse geocode).
 * Mount once under the main tab layout so Report / Watch Me share the same location.
 */
export function useSyncUserLocation() {
  const isLocationModalVisible = useLocationStore((s) => s.isLocationModalVisible);
  const refresh = useUserLocationStore((s) => s.refresh);
  const didInitialRefresh = useRef(false);

  useEffect(() => {
    if (!didInitialRefresh.current) {
      didInitialRefresh.current = true;
      void refresh();
      return;
    }
    if (!isLocationModalVisible) {
      void refresh({ silentIfDenied: true });
    }
  }, [isLocationModalVisible, refresh]);
}
