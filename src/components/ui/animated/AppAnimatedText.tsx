import type { ComponentProps } from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

export type AppAnimatedTextProps = ComponentProps<typeof AnimatedText>;

/**
 * App wrapper around Reanimated Text.
 */
export function AppAnimatedText(props: AppAnimatedTextProps) {
  return <AnimatedText {...props} />;
}
