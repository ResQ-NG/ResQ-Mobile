import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointRotateBoldIcon from '@/components/icons/solar/map-point-rotate-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import SolarSettingsBoldIcon from '@/components/icons/solar/settings-bold';
import MingcuteSearchLineIcon from '@/components/icons/mingcute/search-line';
import SolarReelBoldIcon from '@/components/icons/solar/reel-bold';
import { RoundedButton } from '@/components/ui/RoundedButton';

interface WatchMeSidebarProps {
  onResetLocation?: () => void;
  onExpandPress?: () => void;
}

const GLASS_BUTTON_CLASS =
  'bg-[rgba(18,18,18,0.8)] border border-[rgba(255,255,255,0.18)]';

export function WatchMeSidebar({
  onResetLocation,
  onExpandPress,
}: WatchMeSidebarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();

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
        onPress={onExpandPress}
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
          <SolarReelBoldIcon
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
          <SolarSettingsBoldIcon
            width={20}
            height={20}
            color={theme.iconOnAccent}
          />
        }
        className={GLASS_BUTTON_CLASS}
      />
    </AppAnimatedView>
  );
}
