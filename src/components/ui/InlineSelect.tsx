import { useState, type ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarAltArrowDownBoldIcon from '@/components/icons/solar/alt-arrow-down-bold';
import SolarUserSpeakBoldIcon from '@/components/icons/solar/user-speak-bold';

const BORDER_CLASS =
  'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]';

export type InlineSelectOption = { value: string; label: string };

export type InlineSelectProps = {
  options: InlineSelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Optional per-option icon renderer (e.g. different icon for each relationship). */
  getIconForOption?: (
    option: InlineSelectOption,
    size: 'small' | 'large',
    selected: boolean
  ) => ReactNode;
};

/**
 * Inline dropdown that expands below the trigger (same pattern as DestinationSearchInput).
 * Use in bottom sheets / forms where a full-screen modal dropdown is not desired.
 */
export function InlineSelect({
  options,
  value,
  onChange,
  placeholder = 'Select',
  getIconForOption,
}: InlineSelectProps) {
  const { theme } = useAppColorScheme();
  const [open, setOpen] = useState(false);

  const selected = value ? options.find((o) => o.value === value) : null;
  const displayText = selected?.label ?? placeholder;

  const handleSelect = (option: InlineSelectOption) => {
    onChange(option.value);
    setOpen(false);
  };

  return (
    <View style={{ zIndex: 99999 }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
        className={`flex-row items-center min-h-[48px] px-4 gap-2 ${BORDER_CLASS} ${open ? 'rounded-t-2xl' : 'rounded-full'}`}
        style={{
          backgroundColor: theme.surfaceBackground,
          borderBottomWidth: open ? 0 : 1,
        }}
      >
        <SolarUserSpeakBoldIcon
          width={20}
          height={20}
          color={theme.textMuted}
        />
        <AppText
          className={`flex-1 font-metropolis-regular min-h-[46px] py-3 ${
            selected
              ? 'text-primaryDark dark:text-primaryDark-dark'
              : 'text-captionDark dark:text-captionDark-dark'
          }`}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <SolarAltArrowDownBoldIcon
          width={20}
          height={20}
          color={theme.textMuted}
        />
      </TouchableOpacity>

      {open && (
        <View
          className={`rounded-b-2xl ${BORDER_CLASS} border-t-0 overflow-hidden`}
          style={{ backgroundColor: theme.surfaceBackground }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
                className="px-4 py-3 flex-row items-center gap-2"
                style={{
                  borderTopWidth: 1,
                  borderTopColor: theme.avatarBorder,
                }}
              >
                {getIconForOption ? (
                  getIconForOption(option, 'small', isSelected)
                ) : (
                  <SolarUserSpeakBoldIcon
                    width={16}
                    height={16}
                    color={theme.textMuted}
                  />
                )}
                <AppText
                  className={`font-metropolis-regular ${
                    isSelected
                      ? 'font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark'
                      : 'text-primaryDark dark:text-primaryDark-dark'
                  }`}
                  numberOfLines={1}
                >
                  {option.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
