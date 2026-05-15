import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui';
import SolarBoltBoldIcon from '@/components/icons/solar/bolt-bold';
import { useEndWatchMeConfirmStore } from '@/stores/end-watch-me-confirm-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

export function WatchMeSessionCard() {
  const openConfirmSheet = useEndWatchMeConfirmStore((s) => s.open);

  const handleEndSession = () => openConfirmSheet();
  const handleViewSession = usePreventDoublePress(() => {
    router.push('/screens/watch-me-session');
  });

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(80)}
      className="px-4"
    >
      <TouchableOpacity
        onPress={handleViewSession}
        activeOpacity={0.92}
        accessibilityRole="button"
        accessibilityLabel="View session details"
      >
      <View className="rounded-2xl overflow-hidden bg-success-green dark:bg-success-green-dark border border-[rgba(255,255,255,0.2)]">
        <View className="flex-row items-center gap-3 px-4 py-3.5">
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <SolarBoltBoldIcon width={20} height={20} color="#fff" />
          </View>
          <View className="flex-1 min-w-0">
            <AppText className="text-white font-metropolis-semibold text-sm">
              Watch Me is on
            </AppText>
            <AppText className="text-white/90 text-xs mt-0.5 font-metropolis-regular">
              Your contacts can see your location
            </AppText>
          </View>
          <AppButton
            variant="secondary"
            size="sm"
            className="bg-white/95 border-0"
            labelClassName="text-primary-dark font-metropolis-semibold text-xs"
            onPress={handleEndSession}
          >
            End session
          </AppButton>
        </View>
      </View>
      </TouchableOpacity>
    </AppAnimatedView>
  );
}
