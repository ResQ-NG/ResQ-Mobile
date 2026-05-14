import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchMapboxPlaceSuggestions,
  type MapboxPlaceFeature,
} from '@/lib/third-party/mapbox/forward-geocode';
import { resolvePlaceSearchRemoteProvider } from '@/lib/place-search/engine';
import {
  fetchGoogleAutocompletePredictions,
  fetchGooglePlaceDetails,
  newSessionToken,
} from '@/lib/third-party/google/places-autocomplete';
import { useUserLocationStore } from '@/stores/user-location-store';

export const PLACE_SEARCH_DEBOUNCE_MS = 360;

/** Shown when no remote search API key is configured. */
export const DEFAULT_LOCAL_PLACE_SUGGESTIONS = [
  'Lekki Phase 1, Lagos',
  'Victoria Island, Lagos',
  'Ikeja GRA, Lagos',
  'Ajah, Lagos',
  'Yaba, Lagos',
  'Surulere, Lagos',
  'Ikorodu, Lagos',
  'Maryland, Lagos',
];

export type PlaceSearchRow = Pick<MapboxPlaceFeature, 'id' | 'label'> &
  Partial<Pick<MapboxPlaceFeature, 'longitude' | 'latitude'>>;

export interface UsePlaceSearchSuggestionsParams {
  value: string;
  onChangeText: (value: string) => void;
  onSelectSuggestion?: (value: string) => void;
  onSelectPlace?: (place: MapboxPlaceFeature) => void;
  fallbackLocalSuggestions?: string[];
}

export interface UsePlaceSearchSuggestionsResult {
  remoteProvider: 'google' | 'mapbox' | null;
  displayRows: PlaceSearchRow[];
  showSuggestions: boolean;
  showRemoteDropdown: boolean;
  showLocalDropdown: boolean;
  showRemoteEmpty: boolean;
  showInputLoading: boolean;
  onTextInputFocus: () => void;
  onTextInputBlur: () => void;
  selectRow: (row: PlaceSearchRow) => void;
}

export function usePlaceSearchSuggestions(
  params: UsePlaceSearchSuggestionsParams
): UsePlaceSearchSuggestionsResult {
  const {
    value,
    onChangeText,
    onSelectSuggestion,
    onSelectPlace,
    fallbackLocalSuggestions = DEFAULT_LOCAL_PLACE_SUGGESTIONS,
  } = params;

  const [isFocused, setIsFocused] = useState(false);
  const [remoteSuggestions, setRemoteSuggestions] = useState<PlaceSearchRow[]>(
    []
  );
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [resolvingSelection, setResolvingSelection] = useState(false);

  const lng = useUserLocationStore((s) => s.coordinates[0]);
  const lat = useUserLocationStore((s) => s.coordinates[1]);
  const isLocationFallback = useUserLocationStore((s) => s.isFallback);

  const remoteProvider = resolvePlaceSearchRemoteProvider();

  const proximity = useMemo((): [number, number] | undefined => {
    if (remoteProvider !== 'mapbox' || isLocationFallback) return undefined;
    return [lng, lat];
  }, [remoteProvider, isLocationFallback, lng, lat]);

  const localFiltered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length === 0) return [] as PlaceSearchRow[];
    return fallbackLocalSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 6)
      .map((label) => ({ id: label, label }));
  }, [value, fallbackLocalSuggestions]);

  const inFlightRef = useRef<AbortController | null>(null);
  const detailReqRef = useRef<AbortController | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!remoteProvider) {
      setRemoteSuggestions([]);
      setRemoteLoading(false);
      return;
    }

    const q = value.trim();
    if (q.length < 2 || !isFocused) {
      inFlightRef.current?.abort();
      inFlightRef.current = null;
      setRemoteSuggestions([]);
      setRemoteLoading(false);
      return;
    }

    inFlightRef.current?.abort();

    const timer = setTimeout(() => {
      const ac = new AbortController();
      inFlightRef.current = ac;
      setRemoteLoading(true);

      if (remoteProvider === 'google') {
        const sessionToken = sessionTokenRef.current;
        if (!sessionToken) {
          setRemoteLoading(false);
          return;
        }
        const locationBias =
          !isLocationFallback
            ? {
                latitude: lat,
                longitude: lng,
                radiusMeters: 50_000 as const,
              }
            : undefined;
        void fetchGoogleAutocompletePredictions({
          input: q,
          sessionToken,
          locationBias,
          signal: ac.signal,
        })
          .then((rows) => {
            if (ac.signal.aborted) return;
            setRemoteSuggestions(
              rows.map((r) => ({ id: r.placeId, label: r.description }))
            );
          })
          .finally(() => {
            if (!ac.signal.aborted) setRemoteLoading(false);
          });
      } else {
        void fetchMapboxPlaceSuggestions({
          query: q,
          proximity,
          signal: ac.signal,
        })
          .then((rows) => {
            if (ac.signal.aborted) return;
            setRemoteSuggestions(rows);
          })
          .finally(() => {
            if (!ac.signal.aborted) setRemoteLoading(false);
          });
      }
    }, PLACE_SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      inFlightRef.current?.abort();
      inFlightRef.current = null;
    };
  }, [
    value,
    isFocused,
    remoteProvider,
    proximity,
    lat,
    lng,
    isLocationFallback,
  ]);

  useEffect(() => {
    return () => {
      detailReqRef.current?.abort();
      if (blurTimerRef.current != null) {
        clearTimeout(blurTimerRef.current);
      }
    };
  }, []);

  const displayRows: PlaceSearchRow[] =
    remoteProvider !== null ? remoteSuggestions : localFiltered;

  const remoteQueryOk = remoteProvider !== null && value.trim().length >= 2;
  const showRemoteDropdown = isFocused && remoteQueryOk;
  const showLocalDropdown =
    isFocused && remoteProvider === null && localFiltered.length > 0;
  const showSuggestions = showRemoteDropdown || showLocalDropdown;

  const selectRow = useCallback(
    (row: PlaceSearchRow) => {
      if (
        remoteProvider === 'google' &&
        (typeof row.longitude !== 'number' ||
          typeof row.latitude !== 'number')
      ) {
        const sessionToken = sessionTokenRef.current;
        if (!sessionToken) {
          onChangeText(row.label);
          onSelectSuggestion?.(row.label);
          setIsFocused(false);
          return;
        }
        detailReqRef.current?.abort();
        const ac = new AbortController();
        detailReqRef.current = ac;
        setResolvingSelection(true);
        void fetchGooglePlaceDetails({
          placeId: row.id,
          sessionToken,
          signal: ac.signal,
        })
          .then((resolved) => {
            if (ac.signal.aborted) return;
            if (resolved) {
              onChangeText(resolved.label);
              onSelectSuggestion?.(resolved.label);
              onSelectPlace?.({
                id: resolved.id,
                label: resolved.label,
                longitude: resolved.longitude,
                latitude: resolved.latitude,
              });
            } else {
              onChangeText(row.label);
              onSelectSuggestion?.(row.label);
            }
            sessionTokenRef.current = newSessionToken();
          })
          .finally(() => {
            if (!ac.signal.aborted) {
              setResolvingSelection(false);
              detailReqRef.current = null;
            }
            setIsFocused(false);
          });
        return;
      }

      onChangeText(row.label);
      onSelectSuggestion?.(row.label);
      if (
        onSelectPlace &&
        typeof row.longitude === 'number' &&
        typeof row.latitude === 'number'
      ) {
        onSelectPlace({
          id: row.id,
          label: row.label,
          longitude: row.longitude,
          latitude: row.latitude,
        });
      }
      setIsFocused(false);
    },
    [remoteProvider, onChangeText, onSelectSuggestion, onSelectPlace]
  );

  const showRemoteEmpty =
    showRemoteDropdown &&
    !remoteLoading &&
    !resolvingSelection &&
    displayRows.length === 0;

  const showInputLoading =
    remoteProvider !== null && (remoteLoading || resolvingSelection);

  const onTextInputFocus = useCallback(() => {
    sessionTokenRef.current = newSessionToken();
    setIsFocused(true);
  }, []);

  const onTextInputBlur = useCallback(() => {
    if (blurTimerRef.current != null) {
      clearTimeout(blurTimerRef.current);
    }
    blurTimerRef.current = setTimeout(() => {
      blurTimerRef.current = null;
      setIsFocused(false);
    }, 220);
  }, []);

  return {
    remoteProvider,
    displayRows,
    showSuggestions,
    showRemoteDropdown,
    showLocalDropdown,
    showRemoteEmpty,
    showInputLoading,
    onTextInputFocus,
    onTextInputBlur,
    selectRow,
  };
}
