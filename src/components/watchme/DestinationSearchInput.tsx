import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import type { MapboxPlaceFeature } from '@/lib/third-party/mapbox/forward-geocode';
import {
  DEFAULT_LOCAL_PLACE_SUGGESTIONS,
  usePlaceSearchSuggestions,
} from '@/lib/place-search/usePlaceSearchSuggestions';

const BORDER_CLASS =
  'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]';

interface DestinationSearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onSelectSuggestion?: (value: string) => void;
  /** Set when the row resolved with coordinates (Google or Mapbox). */
  onSelectPlace?: (place: MapboxPlaceFeature) => void;
  placeholder?: string;
  /** Local substring filter when engine is `local` or remote credentials are missing. */
  fallbackLocalSuggestions?: string[];
}

export function DestinationSearchInput({
  value,
  onChangeText,
  onSelectSuggestion,
  onSelectPlace,
  placeholder = 'Search or type destination',
  fallbackLocalSuggestions = DEFAULT_LOCAL_PLACE_SUGGESTIONS,
}: DestinationSearchInputProps) {
  const { theme } = useAppColorScheme();
  const {
    remoteProvider,
    displayRows,
    showSuggestions,
    showRemoteDropdown,
    showRemoteEmpty,
    showInputLoading,
    onTextInputFocus,
    onTextInputBlur,
    selectRow,
  } = usePlaceSearchSuggestions({
    value,
    onChangeText,
    onSelectSuggestion,
    onSelectPlace,
    fallbackLocalSuggestions,
  });

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
          onFocus={onTextInputFocus}
          onBlur={onTextInputBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          className="flex-1 font-metropolis-regular text-primaryDark dark:text-primaryDark-dark min-h-[46px] py-0"
          style={{ fontSize: 16 }}
        />
        {showInputLoading ? (
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
              onPress={() => selectRow(row)}
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
          {showRemoteEmpty ? (
            <View className="px-4 py-3">
              <AppText
                variant="caption"
                className="text-captionDark dark:text-captionDark-dark"
              >
                No places found.
              </AppText>
            </View>
          ) : null}
          {remoteProvider === 'mapbox' && showRemoteDropdown ? (
            <View className="px-4 pb-2 pt-1">
              <AppText
                variant="caption"
                className="text-center text-[10px] text-captionDark dark:text-captionDark-dark"
              >
                © Mapbox © OpenStreetMap
              </AppText>
            </View>
          ) : null}
          {remoteProvider === 'google' && showRemoteDropdown ? (
            <View className="px-4 pb-2 pt-1">
              <AppText
                variant="caption"
                className="text-center text-[10px] text-captionDark dark:text-captionDark-dark"
              >
                Powered by Google
              </AppText>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
