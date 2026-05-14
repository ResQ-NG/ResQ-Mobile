import Constants from 'expo-constants';
import { MAPBOX_ACCESS_TOKEN } from '@/lib/third-party/mapbox/constants';
import { GOOGLE_MAPS_API_KEY } from '@/lib/third-party/google/constants';

/**
 * Which backend powers destination autocomplete.
 * Set `EXPO_PUBLIC_PLACE_SEARCH_ENGINE` (or `expo.extra.PLACE_SEARCH_ENGINE`).
 *
 * - `google` — Google Places Autocomplete + Details (needs API key)
 * - `mapbox` — Mapbox forward geocode (needs token)
 * - `local` — In-memory Lagos suggestions only
 * - `auto` — Use Google if key is set, else Mapbox if token is set, else local
 */
export type PlaceSearchEngineId = 'google' | 'mapbox' | 'local' | 'auto';

const RAW =
  process.env.EXPO_PUBLIC_PLACE_SEARCH_ENGINE ||
  (Constants.expoConfig?.extra?.PLACE_SEARCH_ENGINE as string | undefined);

function parsePlaceSearchEngine(raw: string | undefined): PlaceSearchEngineId {
  const t = raw?.trim().toLowerCase();
  if (
    t === 'google' ||
    t === 'mapbox' ||
    t === 'local' ||
    t === 'auto'
  ) {
    return t;
  }
  return 'auto';
}

export const PLACE_SEARCH_ENGINE: PlaceSearchEngineId =
  parsePlaceSearchEngine(RAW);

export function resolvePlaceSearchRemoteProvider(): 'google' | 'mapbox' | null {
  const hasGoogle = Boolean(GOOGLE_MAPS_API_KEY?.length);
  const hasMapbox = Boolean(MAPBOX_ACCESS_TOKEN?.length);

  switch (PLACE_SEARCH_ENGINE) {
    case 'google':
      return hasGoogle ? 'google' : null;
    case 'mapbox':
      return hasMapbox ? 'mapbox' : null;
    case 'local':
      return null;
    case 'auto':
    default:
      if (hasGoogle) return 'google';
      if (hasMapbox) return 'mapbox';
      return null;
  }
}
