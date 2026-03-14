import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/** Subtle horizontal shake (small amplitude, shake then pause). Use different delayMs per instance so they don't oscillate in sync. */
export function useShakeAttention(options?: { delayMs?: number }) {
  const delayMs = options?.delayMs ?? 0;
  const x = useSharedValue(0);
  useEffect(() => {
    const shakeBurst = withSequence(
      withTiming(-2, { duration: 45, easing: Easing.out(Easing.quad) }),
      withTiming(2, { duration: 45, easing: Easing.inOut(Easing.quad) }),
      withTiming(-1, { duration: 40 }),
      withTiming(0, { duration: 50 }),
      withDelay(1100, withTiming(0, { duration: 0 }))
    );
    x.value = withDelay(delayMs, withRepeat(shakeBurst, -1, false));
    return () => {
      x.value = withTiming(0);
    };
  }, [x, delayMs]);
  return useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));
}
