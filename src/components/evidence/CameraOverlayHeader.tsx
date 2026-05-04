import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInDown } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarSirenRoundedBoldIcon from '@/components/icons/solar/siren-rounded-bold';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import SolarClockCircleBoldIcon from '@/components/icons/solar/clock-circle-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';

interface CameraOverlayHeaderProps {
  location?: string;
  avatarUri?: string;
  /** When set, show back button instead of avatar and hide SOS (e.g. SOS evidence screen). */
  onBack?: () => void;
  /** Tap: show confirmation sheet. Long-press: dispatch immediately. */
  onSosPress?: () => void;
  onSosLongPress?: () => void;
}

export function CameraOverlayHeader({
  location = 'GETTING LOCATION…',
  avatarUri,
  onBack,
  onSosPress,
  onSosLongPress,
}: CameraOverlayHeaderProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();
  const iconColor = theme.iconOnAccent;

  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.6);

  React.useEffect(() => {
    rippleScale.value = withRepeat(
      withTiming(1.4, { duration: 1400, easing: Easing.out(Easing.quad) }),
      -1,
      true
    );
    rippleOpacity.value = withRepeat(
      withTiming(0, { duration: 1400, easing: Easing.out(Easing.quad) }),
      -1,
      true
    );
  }, [rippleScale, rippleOpacity]);

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  return (
    <AppAnimatedView
      entering={brandFadeInDown}
      className="absolute left-0 right-0 px-4 pt-2 gap-[10px]"
      style={{ top: insets.top }}
    >
      {/* Row 1: Avatar or Back left — SOS or nothing right */}
      <View className="flex-row items-center justify-between">
        {onBack ? (
          <AppAnimatedView entering={brandFadeInDown.delay(60)}>
            <RoundedButton
              onPress={onBack}
              icon={
                <SolarArrowLeftBrokenIcon width={20} height={20} color="#fff" />
              }
              className="bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.2)]"
              accessibilityLabel="Back"
            />
          </AppAnimatedView>
        ) : (
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
        )}

        {!onBack && (onSosPress != null || onSosLongPress != null) ? (
          <View className="flex-row items-center gap-2">
            <AppAnimatedView
              entering={brandFadeInDown.delay(100)}
              className="flex-row items-center gap-2 px-1 py-1 rounded-full bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.12)]"
            >
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
                    rippleStyle,
                  ]}
                />
                <Pressable
                  onPress={onSosPress}
                  onLongPress={onSosLongPress}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  className="w-12 h-12 rounded-full bg-accent-red dark:bg-accent-red-dark border border-red-400/50 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="SOS — tap to confirm, hold to send immediately"
                >
                  <SolarSirenRoundedBoldIcon
                    width={20}
                    height={20}
                    color={iconColor}
                  />
                </Pressable>
              </View>
            </AppAnimatedView>
          </View>
        ) : (
          <View />
        )}
      </View>

      {/* Row 2: Location + Time (only when not in back mode) */}
      {!onBack && (
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
              <SolarClockCircleBoldIcon
                width={14}
                height={14}
                color={iconColor}
              />
              <AppText className="text-white text-[13px] font-metropolis-bold tracking-wide">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </AppText>
            </View>
          </AppAnimatedView>
        </View>
      )}
    </AppAnimatedView>
  );
}
