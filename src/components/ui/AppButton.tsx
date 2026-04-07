import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { cn } from '@/lib/cn';
import { useAppColorScheme } from '@/theme/colorMode';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-blue active:opacity-90',
  accent: 'bg-accent-red active:opacity-90',
  secondary: 'bg-surface-light dark:bg-surface-dark active:opacity-90',
  outline: 'border-2 border-primaryDark dark:border-primaryDark-dark bg-transparent active:opacity-80',
  ghost: 'bg-transparent active:opacity-70',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-3',
  md: 'py-3 px-5',
  lg: 'py-4 px-6',
};

const labelColorStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  accent: 'text-white',
  secondary: 'text-primaryDark dark:text-primaryDark-dark',
  outline: 'text-primaryDark dark:text-primaryDark-dark',
  ghost: 'text-primary-blue',
};

export type AppButtonProps = PressableProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  labelClassName?: string;
  /** Shows a spinner and blocks presses while true. */
  loading?: boolean;
  children: React.ReactNode;
};

export function AppButton({
  variant = 'primary',
  size = 'md',
  className = '',
  labelClassName = '',
  children,
  disabled,
  loading = false,
  ...rest
}: AppButtonProps) {
  const { theme } = useAppColorScheme();
  const isDisabled = Boolean(disabled) || loading;

  const combined = cn(
    'items-center justify-center rounded-full',
    variantStyles[variant],
    sizeStyles[size],
    disabled && !loading && 'opacity-60',
    className
  );

  const labelCombined = cn(
    labelColorStyles[variant],
    'font-metropolis-semibold',
    loading && 'opacity-90',
    labelClassName
  );

  const labelSize =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  const spinnerColor =
    variant === 'primary' || variant === 'accent'
      ? theme.iconOnAccent
      : theme.primaryBlue;

  return (
    <Pressable
      {...rest}
      className={combined}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <ActivityIndicator
            color={spinnerColor}
            size="small"
            accessibilityLabel="Loading"
          />
        ) : null}
        <AppText variant="body" className={`${labelSize} ${labelCombined}`}>
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}
