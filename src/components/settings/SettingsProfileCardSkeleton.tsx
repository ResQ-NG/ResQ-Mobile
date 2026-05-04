import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { cn } from '@/lib/cn';

function SkeletonPulse({
  className,
  style,
}: {
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useSharedValue(0.42);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 650,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.42, {
          duration: 650,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[animatedStyle, style]}
      className={cn('bg-gray-200 dark:bg-gray-700', className)}
    />
  );
}

export function SettingsProfileCardSkeleton() {
  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(60)}
      className="mb-8 flex-row items-center gap-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Loading profile"
    >
      <SkeletonPulse className="h-24 w-24 rounded-full" />
      <View className="flex-1 gap-3">
        <SkeletonPulse className="h-7 w-[72%] rounded-md" />
        <SkeletonPulse className="h-4 w-full max-w-[280px] rounded-md" />
        <SkeletonPulse className="mt-1 h-7 w-[48%] rounded-full" />
      </View>
    </AppAnimatedView>
  );
}
