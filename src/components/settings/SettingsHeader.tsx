import { Pressable } from 'react-native';
import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';

interface SettingsHeaderProps {
  onNotificationsPress?: () => void;
}

export function SettingsHeader({ onNotificationsPress }: SettingsHeaderProps) {
  return (
    <AppAnimatedView
      entering={brandFadeIn}
      className="flex-row items-center justify-between mb-6"
    >
      <AppHeading level={2}>Settings</AppHeading>
      <Pressable
        onPress={onNotificationsPress}
        className="w-12 h-12 rounded-full bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)] items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <SolarBellBoldIcon width={20} height={20} color="#6b7280" />
      </Pressable>
    </AppAnimatedView>
  );
}
