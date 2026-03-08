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
        {leftIcon}
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
          {...restInputProps}
        />
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
      {...rest}
    />
  );
}
