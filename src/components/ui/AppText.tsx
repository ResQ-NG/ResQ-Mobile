import { Text, TextProps } from 'react-native';

type TextVariant = 'body' | 'caption';

/** Body uses primaryDark; caption uses captionDark. For dark mode use className="text-primaryDark-dark" or "text-captionDark-dark". */
const variantStyles: Record<TextVariant, string> = {
  body: 'text-base font-metropolis-regular text-primaryDark',
  caption: 'text-sm font-metropolis-regular text-captionDark',
};

export type AppTextProps = TextProps & {
  /** body = primary text (primaryDark), caption = secondary/muted (captionDark) */
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
};

export function AppText({
  variant = 'body',
  className = '',
  children,
  ...rest
}: AppTextProps) {
  const variantClass = variantStyles[variant];
  const combined = [variantClass, className].filter(Boolean).join(' ');

  return (
    <Text className={combined} {...rest}>
      {children}
    </Text>
  );
}
