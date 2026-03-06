import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';

interface SettingsHeaderProps {
  onNotificationsPress?: () => void;
}

export function SettingsHeader({ onNotificationsPress }: SettingsHeaderProps) {
  return (
    <AppAnimatedView
      entering={brandFadeIn}
      className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black"
    >
      <AppHeading level={3}>Settings</AppHeading>
      <RoundedButton
        onPress={onNotificationsPress}
        icon={<SolarBellBoldIcon width={20} height={20} color="#6b7280" />}
        className="bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]"
        accessibilityLabel="Notifications"
      />
    </AppAnimatedView>
  );
}
