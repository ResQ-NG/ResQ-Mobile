import type { ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { cn } from '@/lib/cn';

export type RoundedButtonProps = Omit<
  TouchableOpacityProps,
  'children'
> & {
  /** Icon or element to render inside the button (e.g. <Icon width={20} height={20} color="..." />) */
  icon: ReactNode;
  /** Optional extra Tailwind classes (merged with base w-12 h-12 rounded-full) */
  className?: string;
};

const BASE_CLASS = 'w-12 h-12 rounded-full items-center justify-center';

/**
 * Full-circle icon button (48×48). Use for header actions, overlays, etc.
 */
export function RoundedButton({
  onPress,
  icon,
  className,
  accessibilityRole = 'button',
  activeOpacity = 0.7,
  ...rest
}: RoundedButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      className={cn(BASE_CLASS, className)}
      accessibilityRole={accessibilityRole}
      {...rest}
    >
      {icon}
    </TouchableOpacity>
  );
}
