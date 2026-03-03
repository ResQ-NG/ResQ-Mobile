import type { ComponentProps } from 'react';
import Animated from 'react-native-reanimated';

export type AppAnimatedViewProps = ComponentProps<typeof Animated.View>;

/**
 * App wrapper around Reanimated View.
 */
export function AppAnimatedView(props: AppAnimatedViewProps) {
  return <Animated.View {...props} />;
}
