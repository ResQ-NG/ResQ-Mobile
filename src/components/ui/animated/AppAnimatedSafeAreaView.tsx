import type { ComponentProps } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export type AppAnimatedSafeAreaViewProps = ComponentProps<typeof SafeAreaView> &
  ComponentProps<typeof Animated.View>;

/**
 * App wrapper around Reanimated SafeAreaView.
 */
export function AppAnimatedSafeAreaView(props: AppAnimatedSafeAreaViewProps) {
  return <AnimatedSafeAreaView {...(props as any)} />;
}
