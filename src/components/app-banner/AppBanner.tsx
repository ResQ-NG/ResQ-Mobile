import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import type { AppBanner } from '@/stores/app-banner-store';

interface AppBannerProps {
  banner: AppBanner;
  onClose: () => void;
  autoDismiss?: boolean;
}

export function AppBannerView({
  banner,
  onClose,
  autoDismiss = false,
}: AppBannerProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (autoDismiss) {
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  }, [autoDismiss, onClose]);

  const translateY = useSharedValue(-32);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [opacity, translateY]);

  const handleClose = () => {
    opacity.value = withTiming(
      0,
      {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      }
    );
    translateY.value = withTiming(-32, {
      duration: 220,
      easing: Easing.in(Easing.cubic),
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50"
      pointerEvents="box-none"
    >
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={['#F56C13', '#F56C13', '#D1443A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ overflow: 'hidden', paddingTop: insets.top + 8 }}
        >
          <View className="flex-row flex-start justify-between px-4 py-2.5 items-start">
            <View className="pt-0.5 mr-2.5">
              <SolarInfoCircleBoldIcon width={20} height={20} color="#ffffff" />
            </View>

            <View className="flex-1 mr-3 min-w-0">
              <AppText className="text-white font-metropolis-semibold text-sm">
                {banner.title}
              </AppText>
              <AppText className="text-white/95 text-xs mt-0.5 font-metropolis-regular leading-5">
                {banner.message}
              </AppText>
            </View>
            <View className="flex-row items-center gap-2">
              {banner.actionLabel && (
                <AppButton
                  size="md"
                  variant="secondary"
                  className="bg-white/95 "
                  labelClassName="text-xs font-metropolis-semibold text-primary-dark"
                  onPress={() => {
                    banner.onActionPress?.();
                    onClose();
                  }}
                >
                  {banner.actionLabel}
                </AppButton>
              )}
              {banner.dismissable && (
                <TouchableOpacity
                  onPress={handleClose}
                  hitSlop={12}
                  className="w-8 h-8 rounded-full bg-white/20 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss"
                >
                  <AppText className="text-white text-lg font-metropolis-bold leading-5">
                    ×
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}
