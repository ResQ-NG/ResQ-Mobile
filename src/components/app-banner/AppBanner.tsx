import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import type { AppBanner } from '@/stores/app-banner-store';

interface AppBannerProps {
  banner: AppBanner;
  onClose: () => void;
}

export function AppBannerView({ banner, onClose }: AppBannerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50"
      pointerEvents="box-none"
    >
      <Pressable
        onPress={onClose}
        className="absolute top-0 left-0 right-0"
        pointerEvents="box-none"
      />

      <View className="">
        <LinearGradient
          colors={['#F56C13', '#F56C13', '#D1443A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ overflow: 'hidden', paddingTop: insets.top + 8 }}
        >
          <View className="flex-row flex-start justify-between px-4 py-2.5">
            <View className="pt-0.5 mr-2.5">
              <SolarInfoCircleBoldIcon width={20} height={20} color="#ffffff" />
            </View>

            <View className="flex-1 mr-3">
              <AppText className="text-white font-metropolis-semibold text-sm">
                {banner.title}
              </AppText>
              <AppText className="text-white/95 text-xs mt-0.5 font-metropolis-regular leading-5">
                {banner.message}
              </AppText>
            </View>
            <View className="">
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
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
