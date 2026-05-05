import { create } from 'zustand';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { DEFAULT_USA_COORDINATES } from '@/lib/third-party/mapbox/constants';
import { useLocationStore } from '@/stores/location-store';
import { logger } from '@/lib/utils/logger';

export type UserLocationSnapshot = {
  coordinates: [number, number];
  /** Short area line for UI (e.g. header pill) */
  addressLabel: string;
  /** True when using default coords / permission denied / error */
  isFallback: boolean;
};

/** Shown while the first (or in-flight) refresh has not finished. */
export const USER_LOCATION_LOADING_LABEL = 'Getting location…';

/**
 * When true, location UI text refers to denial/error (not GPS loading) —
 * taps should offer {@link openEnableLocationModal}.
 */
export function userLocationNeedsRecoveryTapAction(
  s: Pick<UserLocationSnapshot, 'addressLabel' | 'isFallback'>
): boolean {
  return s.isFallback && s.addressLabel !== USER_LOCATION_LOADING_LABEL;
}

export function openEnableLocationModal(): void {
  useLocationStore.getState().setLocationEnabled({ isLocationModalVisible: true });
  router.push('/(modals)/enable-location');
}

type RefreshOptions = {
  /** When true, do not open the enable-location modal (e.g. after user dismissed it). */
  silentIfDenied?: boolean;
};

type UserLocationStore = UserLocationSnapshot & {
  refresh: (options?: RefreshOptions) => Promise<void>;
};

let refreshInFlight = false;

function formatAddressLine(p: Location.LocationGeocodedAddress): string {
  const city = p.city || p.district || p.subregion;
  const region = p.region;
  if (city && region && city !== region) return `${city}, ${region}`;
  if (city) return city;
  if (region) return region;
  if (p.country) return p.country;
  return 'Current location';
}

async function reverseGeocodeLabel(latitude: number, longitude: number): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    const p = results[0];
    if (!p) return 'Current location';
    return formatAddressLine(p);
  } catch (e) {
    logger.warn('reverseGeocode failed', e);
    return 'Current location';
  }
}

export const useUserLocationStore = create<UserLocationStore>((set) => ({
  coordinates: DEFAULT_USA_COORDINATES,
  addressLabel: USER_LOCATION_LOADING_LABEL,
  isFallback: true,

  refresh: async (options?: RefreshOptions) => {
    if (refreshInFlight) return;
    refreshInFlight = true;
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        if (!options?.silentIfDenied) {
          useLocationStore.getState().setLocationEnabled({ isLocationModalVisible: true });
          router.push('/(modals)/enable-location');
        }
        set({
          coordinates: DEFAULT_USA_COORDINATES,
          addressLabel: 'Location access needed',
          isFallback: true,
        });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const lat = currentLocation.coords.latitude;
      const lng = currentLocation.coords.longitude;
      const coords: [number, number] = [lng, lat];
      const rawLabel = await reverseGeocodeLabel(lat, lng);
      const addressLabel = `${rawLabel.toUpperCase()}.`;

      set({
        coordinates: coords,
        addressLabel,
        isFallback: false,
      });
    } catch (err) {
      logger.error('Error fetching user location:', err);
      if (!options?.silentIfDenied) {
        useLocationStore.getState().setLocationEnabled({ isLocationModalVisible: true });
        router.push('/(modals)/enable-location');
      }
      set({
        coordinates: DEFAULT_USA_COORDINATES,
        addressLabel: 'Could not read location',
        isFallback: true,
      });
    } finally {
      refreshInFlight = false;
    }
  },
}));
