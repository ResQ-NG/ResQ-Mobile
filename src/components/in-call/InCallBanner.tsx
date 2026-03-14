import { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import SolarPhoneCallingRoundedBoldIcon from '@/components/icons/solar/phone-calling-rounded-bold';
import { AppText } from '@/components/ui/AppText';
import { useInCallStore } from '@/stores/in-call-store';

/**
 * Floating in-call banner shown when a call is active and the in-call screen is not open.
 * Tapping it opens the in-call modal screen.
 */
export function InCallBanner() {
  const insets = useSafeAreaInsets();
  const { isActive, isModalExpanded, callerName, expandModal } = useInCallStore();

  const handlePress = () => {
    expandModal();
    router.push('/(modals)/in-call');
  };

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const show = isActive && !isModalExpanded;

  useEffect(() => {
    if (show) {
      translateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(-100, {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [show, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!isActive) return null;

  return (
    <Animated.View
      pointerEvents={show ? 'auto' : 'none'}
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Open call"
      >
        <LinearGradient
          colors={['#1e3a5f', '#2563eb', '#1d4ed8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View className="w-10 h-10 rounded-full bg-white/25 items-center justify-center mr-3">
            <SolarPhoneCallingRoundedBoldIcon
              width={22}
              height={22}
              color="#fff"
            />
          </View>
          <View className="flex-1 min-w-0">
            <AppText className="text-white font-metropolis-semibold text-sm">
              {callerName ?? 'Call in progress'}
            </AppText>
            <AppText className="text-white/90 text-xs font-metropolis-regular mt-0.5">
              Tap to open call
            </AppText>
          </View>
          <AppText className="text-white/90 text-lg font-metropolis-bold">
            ↑
          </AppText>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}
