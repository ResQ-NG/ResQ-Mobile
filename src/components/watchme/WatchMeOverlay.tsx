import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp, brandFadeInDown } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import { AppButton, Avatar, AVATAR_BACKGROUNDS } from '../ui';

interface WatchMeOverlayProps {
  location?: string;
  reportsNearby?: number;
  nearestCopy?: string;
  onWatchPress?: () => void;
}

const AVATAR_PLACEHOLDERS = [0, 1, 2, 3, 4];

export function WatchMeOverlay({
  location = 'Maryland, Lagos.',
  reportsNearby = 6,
  nearestCopy = 'Nearest is 3 mins away',
  onWatchPress,
}: WatchMeOverlayProps) {
  const insets = useSafeAreaInsets();

  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom + 16;

  return (
    <View className="absolute inset-0">
      {/* Center / mid-map location pill */}
      <AppAnimatedView
        entering={brandFadeInDown}
        className="absolute self-center flex-row items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.92)] dark:bg-[rgba(18,18,18,0.9)] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.18)]"
        style={{ bottom: 210 + bottomOffset }}
      >
        <SolarMapPointBoldIcon width={18} height={18} color="#0000FF" />
        <AppText className="text-base font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
          {location}
        </AppText>
      </AppAnimatedView>

      {/* Bottom card above tab bar */}
      <AppAnimatedView
        entering={brandFadeInUp.delay(80)}
        className="absolute left-4 right-4 bg-[rgba(255,255,255,0.96)] dark:bg-[rgba(18,18,18,0.95)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.16)] px-5 pt-4 pb-5 items-center justify-center rounded-[3rem]"
        style={{ bottom: bottomOffset }}
      >
        {/* Avatars row */}
        <View className="flex-row -mr-2 mb-3 justify-center items-center">
          {AVATAR_PLACEHOLDERS.map((i) => (
            <AppAnimatedView
              key={i}
              entering={brandFadeInUp.delay(120 + i * 40)}
              className="rounded-full overflow-hidden"
            >
              <Avatar
                size={48}
                backgroundColor={AVATAR_BACKGROUNDS[i % AVATAR_BACKGROUNDS.length]}
              />
            </AppAnimatedView>
          ))}
        </View>

        {/* Copy */}
        <View className="mb-4 items-center justify-center">
          <AppText className="text-base font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
            {reportsNearby} reports nearby
          </AppText>
          <AppText className="text-sm mt-1 text-captionDark dark:text-captionDark-dark">
            {nearestCopy}
          </AppText>
        </View>
        {/* Watch me CTA pill */}
        <AppButton
          variant="primary"
          size="lg"
          className="w-[50%] bg-success-green items-center justify-center"
          onPress={onWatchPress}
        >
          Watch me
        </AppButton>
      </AppAnimatedView>
    </View>
  );
}
