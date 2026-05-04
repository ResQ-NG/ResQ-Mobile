import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { WatchMeHeader, WatchMeSheetContactList } from '@/components/watchme';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
} from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useDeleteEmergencyContactConfirmStore } from '@/stores/delete-emergency-contact-confirm-store';
import { useInviteContactSheetStore } from '@/stores/invite-contact-sheet-store';
import { useGetEmergencyContacts } from '@/network/modules/emergency-contacts/queries';
import { inviteReachabilityPayloadFromUiContact } from '@/network/modules/emergency-contacts/utils';

/**
 * Watch Me contacts page: list all contacts. Add new ones via the bottom sheet.
 * Navigate here from the Watch Me map (sidebar contact icon) or Start Watch Me flow.
 */
export default function WatchMeContactsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const { data: contacts = [] } = useGetEmergencyContacts();
  const openAddSheet = useWatchMeContactsSheetStore((s) => s.openForAdd);
  const openForEdit = useWatchMeContactsSheetStore((s) => s.openForEdit);
  const openDeleteConfirm = useDeleteEmergencyContactConfirmStore(
    (s) => s.open
  );
  const openInviteSheet = useInviteContactSheetStore((s) => s.open);

  const handleBack = usePreventDoublePress(() => router.back());
  const handleAddContactPress = usePreventDoublePress(openAddSheet);

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <AppAnimatedSafeAreaView
        className={`flex-1 ${theme.background}`}
        edges={['top', 'left', 'right']}
        paddingSize="sm"
        header={
          <WatchMeHeader
            onBack={handleBack}
            title="Watch me contacts"
            subtitle="Who can watch your journey"
          />
        }
        footer={
          <View className="px-2" style={{ paddingBottom: insets.bottom }}>
            <AppButton
              variant="primary"
              size="lg"
              className="w-full"
              onPress={handleAddContactPress}
            >
              Add contact
            </AppButton>
          </View>
        }
      >
        <AppAnimatedScrollView
          className="flex-1 pt-8"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <WatchMeSheetContactList
            contacts={contacts}
            onRequestEdit={openForEdit}
            onRequestRemove={(c) =>
              openDeleteConfirm({
                id: c.id,
                name: c.name,
                avatarUrl: c.avatarUrl,
              })
            }
            onInviteContact={(c) =>
              openInviteSheet({
                id: c.id,
                name: c.name,
                avatarUrl: c.avatarUrl,
                phone: inviteReachabilityPayloadFromUiContact(c),
              })
            }
          />

          {contacts.length === 0 && (
            <AppText
              variant="caption"
              className="text-captionDark dark:text-captionDark-dark text-center mt-6"
            >
              Add at least one contact to use Watch Me.
            </AppText>
          )}
        </AppAnimatedScrollView>
      </AppAnimatedSafeAreaView>
    </>
  );
}
