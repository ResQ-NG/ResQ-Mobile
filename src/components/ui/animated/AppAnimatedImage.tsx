import type { ComponentProps } from 'react';
import { Image } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export type AppAnimatedImageProps = ComponentProps<typeof AnimatedImage>;

/**
 * App wrapper around Reanimated Image.
 */
export function AppAnimatedImage(props: AppAnimatedImageProps) {
  return <AnimatedImage {...props} />;
}
