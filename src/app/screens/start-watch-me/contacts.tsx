import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { WatchMeHeader, WatchMeSheetContactList } from '@/components/watchme';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
} from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { showToast } from '@/lib/utils/app-toast';

/**
 * Watch Me contacts page: list all contacts. Add new ones via the bottom sheet.
 * Navigate here from the Watch Me map (sidebar contact icon) or Start Watch Me flow.
 */
export default function WatchMeContactsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const { contacts, removeContact: removeContactFromStore } =
    useWatchMeContactsStore();
  const openAddSheet = useWatchMeContactsSheetStore((s) => s.openForAdd);

  const handleBack = usePreventDoublePress(() => router.back());
  const handleAddContactPress = usePreventDoublePress(openAddSheet);

  const handleRemove = useCallback(
    (id: string) => {
      removeContactFromStore(id);
      showToast({ message: 'Contact removed', variant: 'success' });
    },
    [removeContactFromStore]
  );

  return (
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
        <View className="mt-4 px-2">
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
        <WatchMeSheetContactList contacts={contacts} onRemove={handleRemove} />

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
  );
}
