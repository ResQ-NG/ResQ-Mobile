import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { WatchMeHeader } from '@/components/watchme';
import { useAppColorScheme } from '@/theme/colorMode';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { AppAnimatedSafeAreaView } from '@/lib/animation';

/**
 * Watch Me contact management is shown in the app bottom sheet.
 * This screen opens that sheet when focused and provides a fallback
 * to reopen it if the user dismissed the sheet.
 */
export default function WatchMeContactsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const openSheet = useWatchMeContactsSheetStore((s) => s.open);

  useFocusEffect(
    useCallback(() => {
      openSheet();
    }, [openSheet])
  );

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={
        <WatchMeHeader
          onBack={() => router.back()}
          title="Watch me contacts"
          subtitle="Set up who can watch your journey"
        />
      }
    >
      <View
        className="flex-1 px-4 justify-center items-center"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <AppText
          variant="body"
          className="text-captionDark dark:text-captionDark-dark text-center mb-6"
        >
          Manage your emergency contacts in the sheet above. If you closed it, tap below to open again.
        </AppText>
        <AppButton variant="outline" size="lg" onPress={openSheet}>
          Open contact management
        </AppButton>
      </View>
    </AppAnimatedSafeAreaView>
  );
}
