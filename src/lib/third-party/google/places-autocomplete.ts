import { GOOGLE_MAPS_API_KEY } from './constants';
import { logger } from '@/lib/utils/logger';

/** ISO 3166-1 alpha-2 — same region bias as Mapbox forward geocode. */
const PLACE_SEARCH_COUNTRY = 'ng';

const AUTOCOMPLETE_BASE =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const DETAILS_BASE = 'https://maps.googleapis.com/maps/api/place/details/json';

export type GooglePlacePrediction = {
  placeId: string;
  description: string;
};

function newSessionToken(): string {
  const hex = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .slice(1);
  return `${hex()}${hex()}-${hex()}-${hex()}-${hex()}-${hex()}${hex()}${hex()}`;
}

export { newSessionToken };

type AutocompleteJson = {
  predictions?: { place_id?: string; description?: string }[];
  status?: string;
  error_message?: string;
};

type DetailsJson = {
  result?: {
    place_id?: string;
    formatted_address?: string;
    geometry?: { location?: { lat?: number; lng?: number } };
  };
  status?: string;
  error_message?: string;
};

/**
 * Google Places Autocomplete (legacy JSON).
 * @see https://developers.google.com/maps/documentation/places/web-service/autocomplete
 */
export async function fetchGoogleAutocompletePredictions(params: {
  input: string;
  sessionToken: string;
  /** Bias toward `[latitude, longitude]`. */
  locationBias?: { latitude: number; longitude: number; radiusMeters?: number };
  signal?: AbortSignal;
}): Promise<GooglePlacePrediction[]> {
  const { input, sessionToken, locationBias, signal } = params;
  const key = GOOGLE_MAPS_API_KEY;
  const q = input.trim();
  if (!key || q.length < 2) return [];

  try {
    const search = new URLSearchParams({
      input: q,
      key,
      sessiontoken: sessionToken,
      components: `country:${PLACE_SEARCH_COUNTRY}`,
    });
    if (locationBias) {
      const r = String(locationBias.radiusMeters ?? 50_000);
      search.set(
        'location',
        `${locationBias.latitude},${locationBias.longitude}`
      );
      search.set('radius', r);
    }

    const url = `${AUTOCOMPLETE_BASE}?${search.toString()}`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
      logger.warn('Google Places autocomplete HTTP error', {
        status: res.status,
      });
      return [];
    }

    const data = (await res.json()) as AutocompleteJson;
    if (data.status === 'REQUEST_DENIED' || data.status === 'INVALID_REQUEST') {
      logger.warn('Google Places autocomplete rejected', {
        status: data.status,
        message: data.error_message,
      });
      return [];
    }

    const preds = data.predictions ?? [];
    const out: GooglePlacePrediction[] = [];
    for (const p of preds) {
      const placeId = typeof p.place_id === 'string' ? p.place_id : '';
      const description =
        typeof p.description === 'string' ? p.description.trim() : '';
      if (!placeId || !description) continue;
      out.push({ placeId, description });
    }
    return out;
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return [];
    logger.warn('Google Places autocomplete failed', e);
    return [];
  }
}

export type GoogleResolvedPlace = {
  id: string;
  label: string;
  longitude: number;
  latitude: number;
};

/**
 * Resolves coordinates and formatted address for a place id (closes autocomplete billing session when `sessionToken` is set).
 * @see https://developers.google.com/maps/documentation/places/web-service/details
 */
export async function fetchGooglePlaceDetails(params: {
  placeId: string;
  sessionToken: string;
  signal?: AbortSignal;
}): Promise<GoogleResolvedPlace | null> {
  const { placeId, sessionToken, signal } = params;
  const key = GOOGLE_MAPS_API_KEY;
  if (!key || !placeId) return null;

  try {
    const search = new URLSearchParams({
      place_id: placeId,
      key,
      sessiontoken: sessionToken,
      fields: 'place_id,formatted_address,geometry/location',
    });
    const url = `${DETAILS_BASE}?${search.toString()}`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
      logger.warn('Google Place Details HTTP error', { status: res.status });
      return null;
    }

    const data = (await res.json()) as DetailsJson;
    if (data.status !== 'OK' || !data.result) {
      logger.warn('Google Place Details not OK', {
        status: data.status,
        message: data.error_message,
      });
      return null;
    }

    const r = data.result;
    const lat = r.geometry?.location?.lat;
    const lng = r.geometry?.location?.lng;
    const label =
      typeof r.formatted_address === 'string'
        ? r.formatted_address.trim()
        : '';
    const id = typeof r.place_id === 'string' ? r.place_id : placeId;
    if (typeof lat !== 'number' || typeof lng !== 'number' || !label) {
      return null;
    }
    return { id, label, latitude: lat, longitude: lng };
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return null;
    logger.warn('Google Place Details failed', e);
    return null;
  }
}
