import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMapPointRotateBoldIcon from '@/components/icons/solar/map-point-rotate-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import MingcuteSearchLineIcon from '@/components/icons/mingcute/search-line';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarSirenRoundedBoldIcon from '../icons/solar/siren-rounded-bold';
import SolarPlayStreamBoldIcon from '../icons/solar/play-stream-bold';

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
    </AppAnimatedView>
  );
}
