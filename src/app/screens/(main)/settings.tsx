import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
} from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsProfileCard } from '@/components/settings/SettingsProfileCard';
import { SettingsList } from '@/components/settings/SettingsList';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useGetEmergencyContacts } from '@/network/modules/emergency-contacts/queries';
import { useLogoutConfirmStore } from '@/stores/logout-confirm-store';

export default function SettingsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  const { data: emergencyContacts = [], isPending: emergencyContactsPending } =
    useGetEmergencyContacts();

  const openLogoutConfirm = useLogoutConfirmStore((s) => s.open);

  const openEditProfile = usePreventDoublePress(() =>
    router.push('/screens/settings/edit-profile')
  );

  const openEmergencyContacts = usePreventDoublePress(() =>
    router.push('/screens/start-watch-me/contacts')
  );

  const emergencyContactsSubtitle = emergencyContactsPending
    ? '…'
    : emergencyContacts.length === 0
      ? 'None'
      : `${emergencyContacts.length} ${
          emergencyContacts.length === 1 ? 'person' : 'people'
        }`;

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      header={<SettingsHeader />}
    >
      <AppAnimatedScrollView
        className="flex-1 px-6 pt-8"
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <SettingsProfileCard />
        </TouchableOpacity>
        <SettingsList
          emergencyContactsSubtitle={emergencyContactsSubtitle}
          onEmergencyPress={openEmergencyContacts}
          onHelpPress={() => router.push('/(modals)/how-to-use-app')}
          onLogoutPress={openLogoutConfirm}
        />
      </AppAnimatedScrollView>
    </AppAnimatedSafeAreaView>
  );
}
