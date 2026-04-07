import { useState } from 'react';
import {
  Pressable,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/cn';
import { useAppColorScheme } from '@/theme/colorMode';

const BORDER_CLASS =
  'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]';

export type AppInputProps = TextInputProps & {
  /** Optional left icon (e.g. map pin) */
  leftIcon?: React.ReactNode;
  /** When set with a password field, shows eye control to show/hide text */
  showPasswordToggle?: boolean;
  /** Container className; input uses rounded-2xl and theme bg by default */
  className?: string;
  /** Input text className */
  inputClassName?: string;
};

export function AppInput({
  leftIcon,
  showPasswordToggle = false,
  className = '',
  inputClassName = '',
  placeholderTextColor,
  style,
  secureTextEntry: secureTextEntryProp,
  ...rest
}: AppInputProps) {
  const { theme } = useAppColorScheme();
  const placeholderColor = placeholderTextColor ?? theme.textMuted;
  const [passwordHidden, setPasswordHidden] = useState(true);

  const effectiveSecure = showPasswordToggle
    ? passwordHidden
    : Boolean(secureTextEntryProp);

  const useRow = Boolean(leftIcon || showPasswordToggle);

  if (useRow) {
    const { style: inputStyle, ...restInputProps } = rest as TextInputProps;
    return (
      <View
        className={cn(
          'flex-row items-center rounded-full min-h-[48px] px-4 gap-2',
          BORDER_CLASS,
          className
        )}
        style={[
          { backgroundColor: theme.surfaceBackground, minHeight: 48 },
          style as object,
        ]}
      >
        {leftIcon ?? null}
        <TextInput
          placeholderTextColor={placeholderColor}
          className={cn(
            'flex-1  font-metropolis-regular text-primaryDark dark:text-primaryDark-dark',
            inputClassName
          )}
          style={[
            { paddingVertical: 0, paddingTop: 0, paddingBottom: 0 },
            inputStyle as object,
          ]}
          textAlignVertical="center"
          secureTextEntry={effectiveSecure}
          {...restInputProps}
        />
        {showPasswordToggle ? (
          <Pressable
            onPress={() => setPasswordHidden((h) => !h)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={
              passwordHidden ? 'Show password' : 'Hide password'
            }
          >
            <Ionicons
              name={passwordHidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={theme.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <TextInput
      placeholderTextColor={placeholderColor}
      className={cn(
        'rounded-full min-h-[48px] px-4 font-metropolis-regular text-primaryDark dark:text-primaryDark-dark',
        BORDER_CLASS,
        className,
        inputClassName
      )}
      style={[{ backgroundColor: theme.surfaceBackground }, style]}
      secureTextEntry={effectiveSecure}
      {...rest}
    />
  );
}
