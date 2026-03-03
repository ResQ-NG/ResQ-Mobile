import { Text, TextProps } from 'react-native';
import { cn } from '@/lib/cn';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingColor = 'default' | 'primary' | 'accent' | 'muted';

const levelStyles: Record<HeadingLevel, string> = {
  1: 'text-4xl font-metropolis-extrabold tracking-tight',
  2: 'text-3xl font-metropolis-extrabold tracking-tight',
  3: 'text-2xl font-metropolis-extrabold',
  4: 'text-xl font-metropolis-extrabold',
  5: 'text-lg font-metropolis-extrabold',
  6: 'text-base font-metropolis-extrabold',
};

const colorStyles: Record<HeadingColor, string> = {
  default: 'text-primaryDark',
  primary: 'text-primary-blue',
  accent: 'text-accent-red',
  muted: 'text-captionDark',
};

export type AppHeadingProps = TextProps & {
  /** Semantic level 1–6; controls size and weight */
  level?: HeadingLevel;
  /** Text color from theme */
  color?: HeadingColor;
  /** Extra Tailwind classes (merged with default styles) */
  className?: string;
  children: React.ReactNode;
};

export function AppHeading({
  level = 1,
  color = 'default',
  className = '',
  children,
  ...rest
}: AppHeadingProps) {
  const combined = cn(levelStyles[level], colorStyles[color], className);

  return (
    <Text className={combined} accessibilityRole="header" {...rest}>
      {children}
    </Text>
  );
}
