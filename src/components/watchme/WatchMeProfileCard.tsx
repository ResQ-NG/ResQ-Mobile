import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarClockCircleBoldIcon from '@/components/icons/solar/clock-circle-bold';
import SolarBoltBoldIcon from '@/components/icons/solar/bolt-bold';
import SolarSmartphoneRotateAngleBoldIcon from '@/components/icons/solar/smartphone-rotate-angle-bold';
import { Avatar, AVATAR_BACKGROUNDS, avatarRemoteSource } from '@/components/ui';
import type { ActiveWatch } from './types';
import { getWatchBadgeBg, getWatchBadgeLabel } from './types';

interface WatchMeProfileCardProps {
  watch: ActiveWatch;
}

export function WatchMeProfileCard({ watch }: WatchMeProfileCardProps) {
  const { theme } = useAppColorScheme();
  const badgeBg = getWatchBadgeBg(watch);
  const badgeLabel = getWatchBadgeLabel(watch);
  const avatarSource = avatarRemoteSource(watch.avatarUrl);

  return (
    <View className="pb-1">
      <View className="flex-row items-center gap-3 mb-4">
        <Avatar
          size={52}
          source={avatarSource}
          backgroundColor={
            AVATAR_BACKGROUNDS[(watch.avatarBgIndex ?? 0) % AVATAR_BACKGROUNDS.length]
          }
          altText={watch.name}
        />
        <View className="flex-1">
          <AppText className="text-base font-metropolis-bold text-primaryDark dark:text-primaryDark-dark">
            {watch.name}
          </AppText>
          <View
            style={{
              alignSelf: 'flex-start',
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: badgeBg,
              marginTop: 4,
            }}
          >
            <AppText className="text-xs font-metropolis-semibold text-white">
              {badgeLabel}
            </AppText>
          </View>
        </View>
      </View>

      <View className="gap-3">
        {watch.destination ? (
          <View className="flex-row items-center gap-2">
            <SolarMapPointBoldIcon
              width={16}
              height={16}
              color={theme.primaryBlue}
            />
            <AppText className="text-sm text-primaryDark dark:text-primaryDark-dark flex-1">
              Going to {watch.destination}
            </AppText>
          </View>
        ) : null}
        <View className="flex-row items-center gap-2">
          <SolarClockCircleBoldIcon
            width={16}
            height={16}
            color={theme.textMuted}
          />
          <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
            Last safe ping: {watch.lastOkayAt ?? '—'}
          </AppText>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: watch.isMoving ? '#16A34A' : '#94A3B8',
            }}
          />
          <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
            {watch.isMoving ? 'Moving' : 'Stationary'}
          </AppText>
        </View>
        {watch.batteryPercent != null ? (
          <View className="flex-row items-center gap-2">
            <SolarBoltBoldIcon
              width={16}
              height={16}
              color={theme.textMuted}
            />
            <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
              Battery {watch.batteryPercent}%
            </AppText>
          </View>
        ) : null}
        {watch.deviceInfo ? (
          <View className="flex-row items-center gap-2">
            <SolarSmartphoneRotateAngleBoldIcon
              width={16}
              height={16}
              color={theme.textMuted}
            />
            <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
              {watch.deviceInfo}
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}
