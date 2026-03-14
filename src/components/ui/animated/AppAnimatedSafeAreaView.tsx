import type { ComponentProps, ReactNode } from 'react';
import { View } from 'react-native';
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
    /**
     * Sticky footer rendered below children, pinned to the bottom.
     * Use for primary actions (e.g. Capture evidence). Content should add paddingBottom so it doesn't sit under the footer.
     */
    footer?: ReactNode;
  };

/**
 * App wrapper around Reanimated SafeAreaView. Optional paddingSize applies p-4 / p-6 / p-8.
 * Pass `header` to render a sticky bar pinned above the scrollable content area.
 * Pass `footer` to render a sticky bar pinned to the bottom.
 */
export function AppAnimatedSafeAreaView({
  paddingSize = 'none',
  className,
  header,
  footer,
  children,
  ...props
}: AppAnimatedSafeAreaViewProps) {
  const paddingClass = PADDING_SIZE_CLASSES[paddingSize];
  return (
    <AnimatedSafeAreaView className={cn('flex-1', paddingClass, className)} {...props}>
      {header}
      <View className="flex-1">{children}</View>
      {footer}
    </AnimatedSafeAreaView>
  );
}
