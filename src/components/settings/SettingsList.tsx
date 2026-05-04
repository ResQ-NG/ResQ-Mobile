import { TouchableOpacity, View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import SolarLockKeyholeBoldIcon from '@/components/icons/solar/lock-keyhole-bold';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';
import HugeiconsArrowRight01Icon from '@/components/icons/hugeicons/arrow-right-01';
import { useAppColorScheme } from '@/theme/colorMode';

const ICON_SIZE = 22;

interface SettingsListProps {
  onEmergencyPress?: () => void;
  onPrivacyPress?: () => void;
  onNotificationsPress?: () => void;
  onHelpPress?: () => void;
}

export function SettingsList({
  onEmergencyPress,
  onPrivacyPress,
  onNotificationsPress,
  onHelpPress,
}: SettingsListProps) {
  const { theme } = useAppColorScheme();

  const iconOnColor = theme.iconOnAccent;
  const iconMuted = theme.textMuted;

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(120)}
      className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark"
    >
      {/* Emergency contacts */}
      <TouchableOpacity
        onPress={onEmergencyPress}
        activeOpacity={0.7}
        className="flex-row items-center gap-3 px-4 py-3.5"
        accessibilityRole="button"
        accessibilityLabel="Emergency contacts"
      >
        <View className="w-9 h-9 rounded-full bg-primary-blue dark:bg-primary-blue-dark items-center justify-center">
          <SolarUsersGroupRoundedBoldIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={iconOnColor}
          />
        </View>
        <AppText variant="body" className="flex-1 font-metropolis-medium">
          Emergency contacts
        </AppText>
        <AppText variant="caption" className="text-sm">
          5 people
        </AppText>
      </TouchableOpacity>

      {/* Privacy & security */}
      <TouchableOpacity
        onPress={onPrivacyPress}
        activeOpacity={0.7}
        className="flex-row items-center gap-3 px-4 py-3.5"
        accessibilityRole="button"
        accessibilityLabel="Privacy and security"
      >
        <View className="w-9 h-9 rounded-full bg-[#f97316] items-center justify-center">
          <SolarLockKeyholeBoldIcon
            width={ICON_SIZE - 2}
            height={ICON_SIZE - 2}
            color={iconOnColor}
          />
        </View>
        <AppText variant="body" className="flex-1 font-metropolis-medium">
          Privacy & security
        </AppText>
        <HugeiconsArrowRight01Icon width={18} height={18} color={iconMuted} />
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity
        onPress={onNotificationsPress}
        activeOpacity={0.7}
        className="flex-row items-center gap-3 px-4 py-3.5"
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <View className="w-9 h-9 rounded-full bg-accent-red dark:bg-accent-red-dark items-center justify-center">
          <SolarBellBoldIcon
            width={ICON_SIZE - 2}
            height={ICON_SIZE - 2}
            color={iconOnColor}
          />
        </View>
        <AppText variant="body" className="flex-1 font-metropolis-medium">
          Notifications
        </AppText>
        <HugeiconsArrowRight01Icon width={18} height={18} color={iconMuted} />
      </TouchableOpacity>

      {/* Help & support */}
      <TouchableOpacity
        onPress={onHelpPress}
        activeOpacity={0.7}
        className="flex-row items-center gap-3 px-4 py-3.5"
        accessibilityRole="button"
        accessibilityLabel="Help and support"
      >
        <View className="w-9 h-9 rounded-full bg-success-green dark:bg-success-green-dark items-center justify-center">
          <SolarInfoCircleBoldIcon
            width={ICON_SIZE - 2}
            height={ICON_SIZE - 2}
            color={iconOnColor}
          />
        </View>
        <AppText variant="body" className="flex-1 font-metropolis-medium">
          Help & support
        </AppText>
        <HugeiconsArrowRight01Icon width={18} height={18} color={iconMuted} />
      </TouchableOpacity>
    </AppAnimatedView>
  );
}
