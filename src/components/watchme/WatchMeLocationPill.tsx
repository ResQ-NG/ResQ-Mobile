import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';

interface WatchMeLocationPillProps {
  location: string;
  /** When set, pill opens enable-location (permission / error states). */
  onLocationPress?: () => void;
}

export function WatchMeLocationPill({
  location,
  onLocationPress,
}: WatchMeLocationPillProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();

  const pillClassName =
    'px-4 py-2 rounded-full bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.12)] flex-row items-center gap-1';

  const rowInner = (
    <>
      <SolarMapPointBoldIcon
        width={14}
        height={14}
        color={theme.iconOnAccent}
      />
      <AppText
        className="text-white text-[13px] font-metropolis-bold"
        numberOfLines={1}
      >
        {location}
      </AppText>
    </>
  );

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(40)}
      style={{
        position: 'absolute',
        left: 16,
        top: insets.top + 16,
      }}
    >
      {onLocationPress ? (
        <Pressable
          onPress={onLocationPress}
          accessibilityRole="button"
          accessibilityLabel="Location unavailable. Open location settings."
          className={pillClassName}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          {rowInner}
        </Pressable>
      ) : (
        <View className={pillClassName}>{rowInner}</View>
      )}
    </AppAnimatedView>
  );
}
