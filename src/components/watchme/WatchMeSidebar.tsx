import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointRotateBoldIcon from '@/components/icons/solar/map-point-rotate-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import MingcuteSearchLineIcon from '@/components/icons/mingcute/search-line';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarSirenRoundedBoldIcon from '../icons/solar/siren-rounded-bold';
import SolarPlayStreamBoldIcon from '../icons/solar/play-stream-bold';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface WatchMeSidebarProps {
  onResetLocation?: () => void;
  onExpandPress?: () => void;
  onSosPress?: () => void;
  onSearchPress?: () => void;
}

const GLASS_BUTTON_CLASS =
  'bg-[rgba(18,18,18,0.8)] border border-[rgba(255,255,255,0.18)]';

export function WatchMeSidebar({
  onResetLocation,
  onExpandPress,
  onSosPress,
  onSearchPress,
}: WatchMeSidebarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();

  const sosRippleScale = useSharedValue(1);
  const sosRippleOpacity = useSharedValue(0.6);

  React.useEffect(() => {
    sosRippleScale.value = withRepeat(
      withTiming(1.4, { duration: 1400, easing: Easing.out(Easing.quad) }),
      -1,
      true
    );
    sosRippleOpacity.value = withRepeat(
      withTiming(0, { duration: 1400, easing: Easing.out(Easing.quad) }),
      -1,
      true
    );
  }, [sosRippleScale, sosRippleOpacity]);

  const sosRippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sosRippleScale.value }],
    opacity: sosRippleOpacity.value,
  }));

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(120)}
      style={{
        position: 'absolute',
        right: 16,
        top: insets.top + 140,
        alignItems: 'center',
        gap: 12,
      }}
    >
      <RoundedButton
        onPress={onResetLocation}
        icon={
          <SolarMapPointRotateBoldIcon
            width={20}
            height={20}
            color={theme.iconOnAccent}
          />
        }
        className={GLASS_BUTTON_CLASS}
      />
      <RoundedButton
        onPress={onSearchPress}
        icon={
          <MingcuteSearchLineIcon
            width={20}
            height={20}
            color={theme.iconOnAccent}
          />
        }
        className={GLASS_BUTTON_CLASS}
      />
      <RoundedButton
        onPress={onExpandPress}
        icon={
          <SolarUsersGroupRoundedBoldIcon
            width={20}
            height={20}
            color={theme.iconOnAccent}
          />
        }
        className={GLASS_BUTTON_CLASS}
      />
      <RoundedButton
        onPress={onExpandPress}
        icon={
          <SolarPlayStreamBoldIcon
            width={20}
            height={20}
            color={theme.iconOnAccent}
          />
        }
        className={GLASS_BUTTON_CLASS}
      />
      <View className="relative">
        <Animated.View
          style={[
            {
              position: 'absolute',
              inset: -6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(239,68,68,0.6)',
            },
            sosRippleStyle,
          ]}
        />
        <RoundedButton
          onPress={onSosPress}
          icon={
            <SolarSirenRoundedBoldIcon
              width={20}
              height={20}
              color={theme.iconOnAccent}
            />
          }
          className="bg-accent-red dark:bg-accent-red-dark border border-red-400/50"
        />
      </View>
    </AppAnimatedView>
  );
}
