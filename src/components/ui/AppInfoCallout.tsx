import type { ReactNode } from 'react';
import { View, TouchableOpacity, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';
import { useAppColorScheme } from '@/theme/colorMode';
import { AppText } from '@/components/ui/AppText';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import MingcuteCloseLineIcon from '@/components/icons/mingcute/close-line';

export type AppInfoCalloutProps = {
  title: string;
  children: ReactNode;
  /** When set, shows a dismiss control and calls it on press. */
  onDismiss?: () => void;
  /** Blue info panel (default) — extend with more variants later if needed. */
  variant?: 'blue';
  /** Tailwind classes on the outer container (e.g. horizontal margins). */
  className?: string;
  style?: ViewProps['style'];
};

/**
 * Reusable info panel with icon + title + body. Optional dismiss for transient tips.
 */
export function AppInfoCallout({
  title,
  children,
  onDismiss,
  variant = 'blue',
  className,
  style,
}: AppInfoCalloutProps) {
  const { theme, isDark } = useAppColorScheme();
  const backgroundColor =
    variant === 'blue' ? (isDark ? '#153356' : '#E6F0FF') : '#E6F0FF';

  return (
    <View
      className={cn('relative rounded-2xl flex-row gap-3 p-4', className)}
      style={[{ backgroundColor }, style]}
    >
      {onDismiss ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onDismiss}
          hitSlop={12}
          className="absolute top-2 right-2 z-10 p-1"
        >
          <MingcuteCloseLineIcon width={20} height={20} color={theme.textMuted} />
        </TouchableOpacity>
      ) : null}
      <SolarInfoCircleBoldIcon width={24} height={24} color="#2563eb" />
      <View className={cn('flex-1 min-w-0', onDismiss ? 'pr-7' : undefined)}>
        <AppText className="font-metropolis-bold text-primaryDark dark:text-primaryDark-dark">
          {title}
        </AppText>
        <View className="mt-1">{children}</View>
      </View>
    </View>
  );
}
