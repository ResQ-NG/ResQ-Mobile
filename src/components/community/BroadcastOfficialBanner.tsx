import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import SolarLockKeyholeBoldIcon from '@/components/icons/solar/lock-keyhole-bold';

export function BroadcastOfficialBanner() {
  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(240)}
    >
      <LinearGradient
        colors={['#F56C13', '#F56C13', '#D1443A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View className="flex-row items-start gap-3 p-4">
          <View className="pt-0.5">
            <SolarLockKeyholeBoldIcon width={22} height={22} color="#fff" />
          </View>
          <View className="flex-1">
            <AppText className="text-white font-metropolis-semibold text-base">
              Official broadcasts only.
            </AppText>
            <AppText className="text-white/95 text-sm mt-1 font-metropolis-regular leading-5">
              These messages are from verified government agencies and emergency
              services. You cannot reply to broadcasts.
            </AppText>
          </View>
        </View>
      </LinearGradient>
    </AppAnimatedView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    overflow: 'hidden',
  },
});
