import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import { View } from 'react-native';
import { useTabBadgesStore } from '@/stores/tab-badges-store';

interface SettingsHeaderProps {
  onNotificationsPress?: () => void;
}

export function SettingsHeader({ onNotificationsPress }: SettingsHeaderProps) {
  const { theme } = useAppColorScheme();
  const badgesEnabled = useTabBadgesStore((s) => s.badgesEnabled);
  const notificationsHasUnread = useTabBadgesStore((s) => s.notificationsHasUnread);
  return (
    <AppAnimatedView
      entering={brandFadeIn}
      className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black"
    >
      <AppHeading level={3}>Settings</AppHeading>
      <RoundedButton
        onPress={onNotificationsPress}
        icon={
          <View style={{ position: 'relative' }}>
            <SolarBellBoldIcon width={20} height={20} color={theme.textMuted} />
            {badgesEnabled && notificationsHasUnread ? (
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -4,
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: '#ef4444',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.72)',
                }}
              />
            ) : null}
          </View>
        }
        className="bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]"
        accessibilityLabel="Notifications"
      />
    </AppAnimatedView>
  );
}
