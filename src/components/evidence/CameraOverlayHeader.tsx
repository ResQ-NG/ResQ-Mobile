import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInDown } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { RoundedButton } from '@/components/ui/RoundedButton';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';
import SolarClockCircleBoldIcon from '@/components/icons/solar/clock-circle-bold';
import { useAppColorScheme } from '@/theme/colorMode';

interface CameraOverlayHeaderProps {
  location?: string;
  time?: string;
  avatarUri?: string;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
}

export function CameraOverlayHeader({
  location = 'MARYLAND, LAGOS.',
  time = '9:01:12 PM',
  avatarUri,
  onLocationPress,
  onNotificationPress,
}: CameraOverlayHeaderProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();
  const iconColor = theme.iconOnAccent;

  return (
    <AppAnimatedView
      entering={brandFadeInDown}
      className="absolute left-0 right-0 px-4 pt-2 gap-[10px]"
      style={{ top: insets.top }}
    >
      {/* Row 1: Avatar left — glass pill with action icons right */}
      <View className="flex-row items-center justify-between">
        {/* Avatar */}
        <AppAnimatedView
          entering={brandFadeInDown.delay(60)}
          className="rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.6)]"
        >
          <Avatar
            size={52}
            source={avatarUri ? { uri: avatarUri } : undefined}
            backgroundColor={AVATAR_BACKGROUNDS[1]}
          />
        </AppAnimatedView>

        <View className="flex-row items-center gap-2">
          {/* Glass pill around action icons */}
          <AppAnimatedView
            entering={brandFadeInDown.delay(100)}
            className="flex-row items-center gap-2 px-1 py-1 rounded-full bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.12)]"
          >
            <RoundedButton
              onPress={onNotificationPress}
              icon={<SolarBellBoldIcon width={20} height={20} color={iconColor} />}
            />
          </AppAnimatedView>

          {/* Glass pill around action icons */}
          <AppAnimatedView
            entering={brandFadeInDown.delay(100)}
            className="flex-row items-center gap-2 px-1 py-1 rounded-full bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.12)]"
          >
            <RoundedButton
              onPress={onLocationPress}
              icon={
                <SolarMapPointBoldIcon width={20} height={20} color={iconColor} />
              }
            />
          </AppAnimatedView>
        </View>
      </View>

      {/* Row 2: Location + Time inside a glass pill */}
      <View className="flex-col gap-2 mt-4 ">
        <AppAnimatedView
          entering={brandFadeInDown.delay(160)}
          className="self-start px-4 py-4 rounded-full bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.12)] gap-1"
        >
          <View className="flex-row items-center gap-[6px]">
            <SolarMapPointBoldIcon width={14} height={14} color={iconColor} />
            <AppText className="text-white text-[13px] font-metropolis-bold tracking-wide">
              {location}
            </AppText>
          </View>
        </AppAnimatedView>

        <AppAnimatedView
          entering={brandFadeInDown.delay(160)}
          className="self-start px-4 py-4 rounded-full bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.12)] gap-1"
        >
          <View className="flex-row items-center gap-[6px]">
            <SolarClockCircleBoldIcon width={14} height={14} color={iconColor} />
            <AppText className="text-white text-[13px] font-metropolis-bold tracking-wide">
              {time}
            </AppText>
          </View>
        </AppAnimatedView>
      </View>
    </AppAnimatedView>
  );
}
