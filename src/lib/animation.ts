import Animated from 'react-native-reanimated';

export { AppAnimatedView } from '@/components/ui/animated/AppAnimatedView';
export type { AppAnimatedViewProps } from '@/components/ui/animated/AppAnimatedView';

export { AppAnimatedText } from '@/components/ui/animated/AppAnimatedText';
export type { AppAnimatedTextProps } from '@/components/ui/animated/AppAnimatedText';

export { AppAnimatedImage } from '@/components/ui/animated/AppAnimatedImage';
export type { AppAnimatedImageProps } from '@/components/ui/animated/AppAnimatedImage';

export { AppAnimatedScrollView } from '@/components/ui/animated/AppAnimatedScrollView';
export type { AppAnimatedScrollViewProps } from '@/components/ui/animated/AppAnimatedScrollView';

export { AppAnimatedSafeAreaView } from '@/components/ui/animated/AppAnimatedSafeAreaView';
export type { AppAnimatedSafeAreaViewProps } from '@/components/ui/animated/AppAnimatedSafeAreaView';

export {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  ZoomIn,
  SlideInDown,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export {
  brandFadeIn,
  brandFadeInUp,
  brandFadeInDown,
  brandScaleIn,
} from '@/lib/brandAnimations';

export default Animated;
