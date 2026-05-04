import { useUserLocationStore } from '@/stores/user-location-store';

/**
 * Current device coordinates `[longitude, latitude]` from the shared location store.
 * Mount {@link useSyncUserLocation} once (e.g. main tab layout) so values populate app-wide.
 */
export function useFetchCoordinates(): [number, number] {
  return useUserLocationStore((s) => s.coordinates);
}
