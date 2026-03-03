import { Pressable, PressableProps } from 'react-native';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-blue active:opacity-90',
  accent: 'bg-accent-red active:opacity-90',
  outline: 'border-2 border-primary-blue bg-transparent active:opacity-80',
  ghost: 'bg-transparent active:opacity-70',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-3 rounded-lg',
  md: 'py-3 px-5 rounded-xl',
  lg: 'py-4 px-6 rounded-xl',
};

const labelColorStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  accent: 'text-white',
  outline: 'text-primary-blue',
  ghost: 'text-primary-blue',
};

export type AppButtonProps = PressableProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
};

export function AppButton({
  variant = 'primary',
  size = 'md',
  className = '',
  labelClassName = '',
  children,
  disabled,
  ...rest
}: AppButtonProps) {
  const base = 'items-center justify-center';
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  const disabledClass = disabled ? 'opacity-60' : '';
  const combined = [base, variantClass, sizeClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  const labelColor = labelColorStyles[variant];
  const labelCombined = [labelColor, 'font-metropolis-semibold', labelClassName]
    .filter(Boolean)
    .join(' ');

  const labelSize =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  return (
    <Pressable
      className={combined}
      disabled={disabled}
      accessibilityRole="button"
      {...rest}
    >
      <AppText
        variant="body"
        className={`${labelSize} ${labelCombined}`}
      >
        {children}
      </AppText>
    </Pressable>
  );
}
