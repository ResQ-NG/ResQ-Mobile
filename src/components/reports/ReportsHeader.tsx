import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';
import { View } from 'react-native';
import MingcuteSearchLineIcon from '../icons/mingcute/search-line';
import { useAppColorScheme } from '@/theme/colorMode';

interface ReportsHeaderProps {
  onNotificationsPress?: () => void;
  onSearchPress?: () => void;
}

export function ReportsHeader({ onNotificationsPress, onSearchPress }: ReportsHeaderProps) {
  const { theme } = useAppColorScheme();
  return (
    <AppAnimatedView
      entering={brandFadeIn}
      className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black"
    >
      <AppHeading level={4}>My reports</AppHeading>

      <View className="flex-row items-center gap-2">
        <RoundedButton
          onPress={onSearchPress}
          icon={
            <MingcuteSearchLineIcon width={20} height={20} color={theme.textMuted} />
          }
          className="bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]"
          accessibilityLabel="Notifications"
        />
        <RoundedButton
          onPress={onNotificationsPress}
          icon={<SolarBellBoldIcon width={20} height={20} color={theme.textMuted} />}
          className="bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]"
          accessibilityLabel="Notifications"
        />
      </View>
    </AppAnimatedView>
  );
}
