import type { ComponentProps } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { cn } from '@/lib/cn';
import {
  PADDING_SIZE_CLASSES,
  type PaddingSize,
} from '@/theme/constants';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export type AppAnimatedSafeAreaViewProps = ComponentProps<typeof SafeAreaView> &
  ComponentProps<typeof Animated.View> & {
    /** Optional padding size (from theme constants). Default none. */
    paddingSize?: PaddingSize;
  };

/**
 * App wrapper around Reanimated SafeAreaView. Optional paddingSize applies p-4 / p-6 / p-8.
 */
export function AppAnimatedSafeAreaView({
  paddingSize = 'none',
  className,
  ...props
}: AppAnimatedSafeAreaViewProps) {
  const paddingClass = PADDING_SIZE_CLASSES[paddingSize];
  return (
    <AnimatedSafeAreaView
      className={cn(paddingClass, className)}
      {...props}
    />
  );
}
