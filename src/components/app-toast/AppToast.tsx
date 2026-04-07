import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '@/components/ui/AppText';
import type { AppToast as AppToastType } from '@/stores/app-toast-store';

const SLIDE_DURATION_MS = 280;
const FADE_OUT_DURATION_MS = 320;

/** Horizontal shake keyframes for error toasts (ms per step). */
const SHAKE_STEPS_MS = 42;

interface AppToastViewProps {
  toast: AppToastType;
  onClose: () => void;
}

export function AppToastView({ toast, onClose }: AppToastViewProps) {
  const translateY = useSharedValue(-24);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  /** Stable for runOnJS — reads latest handler from ref. */
  const runDismiss = useCallback(() => {
    onCloseRef.current();
  }, []);

  // Enter: slide in + fade in; error also shakes horizontally
  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: SLIDE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: SLIDE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });

    if (toast.variant === 'error') {
      const d = SHAKE_STEPS_MS;
      const ease = Easing.out(Easing.quad);
      translateX.value = withSequence(
        withTiming(11, { duration: d, easing: ease }),
        withTiming(-11, { duration: d, easing: ease }),
        withTiming(8, { duration: d, easing: ease }),
        withTiming(-8, { duration: d, easing: ease }),
        withTiming(4, { duration: d, easing: ease }),
        withTiming(-4, { duration: d, easing: ease }),
        withTiming(0, { duration: d * 1.5, easing: Easing.out(Easing.cubic) })
      );
    }

    return () => {
      cancelAnimation(translateX);
    };
  }, [translateY, translateX, opacity, toast.variant]);

  // Exit: fade out then remove (cancel in-flight fade if deps change / unmount)
  useEffect(() => {
    if (!toast.exiting) return;

    cancelAnimation(opacity);
    opacity.value = withTiming(
      0,
      {
        duration: FADE_OUT_DURATION_MS,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(runDismiss)();
        }
      }
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, [toast.exiting, opacity, runDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const variant = toast.variant ?? 'default';
  const gradientColors =
    variant === 'success'
      ? ['#16A34A', '#16A34A', '#15803D']
      : variant === 'error'
        ? ['#DC2626', '#DC2626', '#B91C1C']
        : ['#374151', '#374151', '#1f2937'];

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <LinearGradient
        colors={gradientColors as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.toast}
      >
        <AppText className="text-white font-metropolis-medium text-sm text-center">
          {toast.message}
        </AppText>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    maxWidth: '92%',
  },
  toast: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
