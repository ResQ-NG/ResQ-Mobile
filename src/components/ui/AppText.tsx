import { Text, TextProps } from 'react-native';
import { cn } from '@/lib/cn';
import {
  APP_TEXT_VARIANT_STYLES,
  DEFAULT_APP_TEXT_VARIANT,
} from '@/theme/constants';

export type TextVariant = keyof typeof APP_TEXT_VARIANT_STYLES;

export type AppTextProps = TextProps & {
  /** body = primary text (default), caption = secondary/muted. Base never uses caption. */
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
};

export function AppText({
  variant = DEFAULT_APP_TEXT_VARIANT,
  className = '',
  children,
  ...rest
}: AppTextProps) {
  const combined = cn(APP_TEXT_VARIANT_STYLES[variant], className);

  return (
    <Text className={combined} {...rest}>
      {children}
    </Text>
  );
}
