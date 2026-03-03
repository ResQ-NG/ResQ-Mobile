import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import type { DimensionValue } from 'react-native';

const ACCENT_RED = '#F00033';

type OnboardingProgressBarProps = {
  progressWidth: SharedValue<string>;
};

export function OnboardingProgressBar({ progressWidth }: OnboardingProgressBarProps) {
  const style = useAnimatedStyle(() => ({
    width: progressWidth.value as unknown as DimensionValue,
    height: '100%',
    backgroundColor: ACCENT_RED,
  }));

  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <Animated.View style={style} />
    </View>
  );
}
