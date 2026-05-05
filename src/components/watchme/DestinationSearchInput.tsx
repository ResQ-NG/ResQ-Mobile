import { useState, useMemo, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import { MAPBOX_ACCESS_TOKEN } from '@/lib/third-party/mapbox/constants';
import {
  fetchMapboxPlaceSuggestions,
  type MapboxPlaceFeature,
} from '@/lib/third-party/mapbox/forward-geocode';
import { useUserLocationStore } from '@/stores/user-location-store';

const BORDER_CLASS =
  'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]';

const SEARCH_DEBOUNCE_MS = 360;

/** Shown when Mapbox token is missing (offline / misconfiguration). */
const DEFAULT_LOCAL_SUGGESTIONS = [
  'Lekki Phase 1, Lagos',
  'Victoria Island, Lagos',
  'Ikeja GRA, Lagos',
  'Ajah, Lagos',
  'Yaba, Lagos',
  'Surulere, Lagos',
  'Ikorodu, Lagos',
  'Maryland, Lagos',
];

type PlaceRow = Pick<MapboxPlaceFeature, 'id' | 'label'> &
  Partial<Pick<MapboxPlaceFeature, 'longitude' | 'latitude'>>;

interface DestinationSearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onSelectSuggestion?: (value: string) => void;
  /** Set when the row came from Mapbox (includes coordinates). */
  onSelectPlace?: (place: MapboxPlaceFeature) => void;
  placeholder?: string;
  /** Local substring filter when Mapbox is unavailable. */
  fallbackLocalSuggestions?: string[];
}

export function DestinationSearchInput({
  value,
  onChangeText,
  onSelectSuggestion,
  onSelectPlace,
  placeholder = 'Search or type destination',
  fallbackLocalSuggestions = DEFAULT_LOCAL_SUGGESTIONS,
}: DestinationSearchInputProps) {
  const { theme } = useAppColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const [remoteSuggestions, setRemoteSuggestions] = useState<MapboxPlaceFeature[]>(
    []
  );
  const [remoteLoading, setRemoteLoading] = useState(false);

  const lng = useUserLocationStore((s) => s.coordinates[0]);
  const lat = useUserLocationStore((s) => s.coordinates[1]);
  const isLocationFallback = useUserLocationStore((s) => s.isFallback);

  const hasMapboxToken = Boolean(
    MAPBOX_ACCESS_TOKEN && MAPBOX_ACCESS_TOKEN.length > 0
  );
  const proximity = useMemo((): [number, number] | undefined => {
    if (!hasMapboxToken || isLocationFallback) return undefined;
    return [lng, lat];
  }, [hasMapboxToken, isLocationFallback, lng, lat]);

  const localFiltered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length === 0) return [] as PlaceRow[];
    return fallbackLocalSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 6)
      .map((label) => ({ id: label, label }));
  }, [value, fallbackLocalSuggestions]);

  const inFlightRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!hasMapboxToken) {
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
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      inFlightRef.current?.abort();
      inFlightRef.current = null;
    };
  }, [value, isFocused, hasMapboxToken, proximity]);

  const displayRows: PlaceRow[] = hasMapboxToken
    ? remoteSuggestions
    : localFiltered;

  const mapboxQueryOk = hasMapboxToken && value.trim().length >= 2;
  const showMapboxDropdown = isFocused && mapboxQueryOk;
  const showLocalDropdown = isFocused && !hasMapboxToken && localFiltered.length > 0;
  const showSuggestions = showMapboxDropdown || showLocalDropdown;

  const handleSelect = (row: PlaceRow) => {
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
  };

  const showMapboxEmpty =
    showMapboxDropdown && !remoteLoading && displayRows.length === 0;

  return (
    <View>
      <View
        className={`flex-row items-center min-h-[48px] px-4 gap-2 ${BORDER_CLASS} ${showSuggestions ? 'rounded-t-2xl' : 'rounded-full'}`}
        style={{
          backgroundColor: theme.surfaceBackground,
          borderBottomWidth: showSuggestions ? 0 : 1,
        }}
      >
        <SolarMapPointBoldIcon width={20} height={20} color={theme.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 220)}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          className="flex-1 font-metropolis-regular text-primaryDark dark:text-primaryDark-dark min-h-[46px] py-0"
          style={{ fontSize: 16 }}
        />
        {hasMapboxToken && remoteLoading ? (
          <ActivityIndicator size="small" color={theme.textMuted} />
        ) : null}
      </View>

      {showSuggestions && (
        <View
          className={`rounded-b-2xl ${BORDER_CLASS} border-t-0 overflow-hidden`}
          style={{ backgroundColor: theme.surfaceBackground }}
        >
          {displayRows.map((row, index) => (
            <TouchableOpacity
              key={row.id ? `${row.id}-${index}` : `${row.label}-${index}`}
              onPress={() => handleSelect(row)}
              activeOpacity={0.7}
              className="px-4 py-3 flex-row items-center gap-2"
              style={{
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: theme.avatarBorder,
              }}
            >
              <SolarMapPointBoldIcon
                width={16}
                height={16}
                color={theme.textMuted}
              />
              <AppText
                className="flex-1 font-metropolis-regular text-primaryDark dark:text-primaryDark-dark"
                numberOfLines={2}
              >
                {row.label}
              </AppText>
            </TouchableOpacity>
          ))}
          {showMapboxEmpty ? (
            <View className="px-4 py-3">
              <AppText
                variant="caption"
                className="text-captionDark dark:text-captionDark-dark"
              >
                No places found.
              </AppText>
            </View>
          ) : null}
          {hasMapboxToken && showMapboxDropdown ? (
            <View className="px-4 pb-2 pt-1">
              <AppText
                variant="caption"
                className="text-center text-[10px] text-captionDark dark:text-captionDark-dark"
              >
                © Mapbox © OpenStreetMap
              </AppText>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
