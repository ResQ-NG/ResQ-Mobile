import { MAPBOX_ACCESS_TOKEN } from './constants';
import { logger } from '@/lib/utils/logger';

/** ISO 3166-1 alpha-2 — forward geocode is restricted to this country. */
const PLACE_SEARCH_COUNTRY = 'ng';

export type MapboxPlaceFeature = {
  id: string;
  /** Full Mapbox geocoding display string */
  label: string;
  longitude: number;
  latitude: number;
};

type GeocodeResponse = {
  features?: {
    id: string;
    place_name: string;
    geometry?: {
      coordinates?: [number, number];
    };
  }[];
};

/**
 * Forward geocode (autocomplete-friendly) via Mapbox Geocoding API.
 * Results are limited to Nigeria (`country=ng`).
 * @see https://docs.mapbox.com/api/search/geocoding/
 */
export async function fetchMapboxPlaceSuggestions(params: {
  query: string;
  limit?: number;
  /** Bias results toward `[longitude, latitude]`. */
  proximity?: [number, number];
  signal?: AbortSignal;
}): Promise<MapboxPlaceFeature[]> {
  const { query, limit = 8, proximity, signal } = params;
  const q = query.trim();
  const token = MAPBOX_ACCESS_TOKEN;
  if (!token || q.length < 2) return [];

  try {
    const encoded = encodeURIComponent(q);
    const search = new URLSearchParams({
      access_token: token,
      limit: String(limit),
      autocomplete: 'true',
    });
    search.append('country', PLACE_SEARCH_COUNTRY);
    if (proximity?.length === 2) {
      search.set('proximity', `${proximity[0]},${proximity[1]}`);
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?${search.toString()}`;
    const res = await fetch(url, { signal });

    if (!res.ok) {
      logger.warn('Mapbox geocoding HTTP error', {
        status: res.status,
        statusText: res.statusText,
      });
      return [];
    }

    const data = (await res.json()) as GeocodeResponse;
    const feats = data.features ?? [];
    const out: MapboxPlaceFeature[] = [];
    for (const f of feats) {
      const coords = f.geometry?.coordinates;
      const lng = coords?.[0];
      const lat = coords?.[1];
      const label = typeof f.place_name === 'string' ? f.place_name.trim() : '';
      if (!label || typeof lng !== 'number' || typeof lat !== 'number') continue;
      out.push({
        id: f.id || label,
        label,
        longitude: lng,
        latitude: lat,
      });
    }
    return out;
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return [];
    logger.warn('Mapbox geocoding failed', e);
    return [];
  }
}
