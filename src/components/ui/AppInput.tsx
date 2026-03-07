import { TextInput, TextInputProps, View } from 'react-native';
import { cn } from '@/lib/cn';
import { useAppColorScheme } from '@/theme/colorMode';

const BORDER_CLASS =
  'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]';

export type AppInputProps = TextInputProps & {
  /** Optional left icon (e.g. map pin) */
  leftIcon?: React.ReactNode;
  /** Container className; input uses rounded-2xl and theme bg by default */
  className?: string;
  /** Input text className */
  inputClassName?: string;
};

export function AppInput({
  leftIcon,
  className = '',
  inputClassName = '',
  placeholderTextColor,
  style,
  ...rest
}: AppInputProps) {
  const { theme } = useAppColorScheme();
  const placeholderColor = placeholderTextColor ?? theme.textMuted;

  if (leftIcon) {
    return (
      <View
        className={cn(
          'flex-row items-center rounded-2xl px-4 py-3 gap-2',
          BORDER_CLASS,
          className
        )}
        style={[{ backgroundColor: theme.surfaceBackground }, style as object]}
      >
        {leftIcon}
        <TextInput
          placeholderTextColor={placeholderColor}
          className={cn(
            'flex-1 text-base font-metropolis-regular text-primaryDark dark:text-primaryDark-dark py-0',
            inputClassName
          )}
          {...rest}
        />
      </View>
    );
  }

  return (
    <TextInput
      placeholderTextColor={placeholderColor}
      className={cn(
        'rounded-2xl px-4 py-3 text-base font-metropolis-regular text-primaryDark dark:text-primaryDark-dark',
        BORDER_CLASS,
        className,
        inputClassName
      )}
      style={[{ backgroundColor: theme.surfaceBackground }, style]}
      {...rest}
    />
  );
}
