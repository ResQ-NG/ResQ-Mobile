import type { ComponentProps, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { cn } from '@/lib/cn';
import { PADDING_SIZE_CLASSES, type PaddingSize } from '@/theme/constants';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export type AppAnimatedSafeAreaViewProps = ComponentProps<typeof SafeAreaView> &
  ComponentProps<typeof Animated.View> & {
    /** Optional padding size (from theme constants). Default none. */
    paddingSize?: PaddingSize;
    /**
     * Sticky header rendered above children but outside any scroll container.
     * Stays fixed at the top while content scrolls beneath it.
     */
    header?: ReactNode;
  };

/**
 * App wrapper around Reanimated SafeAreaView. Optional paddingSize applies p-4 / p-6 / p-8.
 * Pass `header` to render a sticky bar pinned above the scrollable content area.
 */
export function AppAnimatedSafeAreaView({
  paddingSize = 'none',
  className,
  header,
  children,
  ...props
}: AppAnimatedSafeAreaViewProps) {
  const paddingClass = PADDING_SIZE_CLASSES[paddingSize];
  return (
    <AnimatedSafeAreaView className={cn(paddingClass, className)} {...props}>
      {header}
      {children}
    </AnimatedSafeAreaView>
  );
}
