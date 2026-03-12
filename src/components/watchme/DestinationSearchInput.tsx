import { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';

const BORDER_CLASS =
  'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]';

/** Default place suggestions (can be replaced by API/geocoding later) */
const DEFAULT_SUGGESTIONS = [
  'Lekki Phase 1, Lagos',
  'Victoria Island, Lagos',
  'Ikeja GRA, Lagos',
  'Ajah, Lagos',
  'Yaba, Lagos',
  'Surulere, Lagos',
  'Ikorodu, Lagos',
  'Maryland, Lagos',
];

interface DestinationSearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onSelectSuggestion?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function DestinationSearchInput({
  value,
  onChangeText,
  onSelectSuggestion,
  placeholder = 'Search or type destination',
  suggestions = DEFAULT_SUGGESTIONS,
}: DestinationSearchInputProps) {
  const { theme } = useAppColorScheme();
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length === 0) return [];
    return suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 5);
  }, [value, suggestions]);

  const showSuggestions = isFocused && filteredSuggestions.length > 0;

  const handleSelect = (suggestion: string) => {
    onChangeText(suggestion);
    onSelectSuggestion?.(suggestion);
    setIsFocused(false);
  };

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
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          className="flex-1 font-metropolis-regular text-primaryDark dark:text-primaryDark-dark min-h-[46px] py-0"
          style={{ fontSize: 16 }}
        />
      </View>

      {showSuggestions && (
        <View
          className={`rounded-b-2xl ${BORDER_CLASS} border-t-0 overflow-hidden`}
          style={{ backgroundColor: theme.surfaceBackground }}
        >
          {filteredSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              onPress={() => handleSelect(suggestion)}
              activeOpacity={0.7}
              className="px-4 py-3 flex-row items-center gap-2"
              style={{ borderTopWidth: 1, borderTopColor: theme.avatarBorder }}
            >
              <SolarMapPointBoldIcon
                width={16}
                height={16}
                color={theme.textMuted}
              />
              <AppText
                className="font-metropolis-regular text-primaryDark dark:text-primaryDark-dark"
                numberOfLines={1}
              >
                {suggestion}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
