import type { ComponentProps } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export type AppAnimatedScrollViewProps = ComponentProps<
  typeof AnimatedScrollView
>;

/**
 * App wrapper around Reanimated ScrollView.
 */
export function AppAnimatedScrollView(props: AppAnimatedScrollViewProps) {
  return <AnimatedScrollView {...props} />;
}
