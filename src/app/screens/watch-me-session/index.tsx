import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { WatchMeHeader } from '@/components/watchme';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { useEndWatchMeConfirmStore } from '@/stores/end-watch-me-confirm-store';
import { useGetEmergencyContacts } from '@/network/modules/emergency-contacts/queries';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAppColorScheme } from '@/theme/colorMode';
import { SessionInfoCard } from './components/SessionInfoCard';
import { ActiveWatchersList } from './components/ActiveWatchersList';

export default function WatchMeSessionScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  const sessionStartedAt = useWatchMeContactsStore((s) => s.sessionStartedAt);
  const sessionContactIds = useWatchMeContactsStore((s) => s.sessionContactIds);
  const endSession = useWatchMeContactsStore((s) => s.endSession);

  const openAddContactSheet = useWatchMeContactsSheetStore((s) => s.openForAdd);
  const openEndConfirmSheet = useEndWatchMeConfirmStore((s) => s.open);

  const { data: allContacts = [] } = useGetEmergencyContacts();

  // Local state so remove is instant UI (optimistic)
  const [localContactIds, setLocalContactIds] = useState<string[]>(sessionContactIds);

  const handleRemoveContact = (id: string) => {
    setLocalContactIds((prev) => prev.filter((c) => c !== id));
    // Persist to store
    const { startSession } = useWatchMeContactsStore.getState();
    startSession(localContactIds.filter((c) => c !== id));
  };

  const handleAddMore = usePreventDoublePress(() => {
    openAddContactSheet();
  });

  const handleEndSession = usePreventDoublePress(() => {
    openEndConfirmSheet();
  });

  const handleBack = usePreventDoublePress(() => {
    // Go back to Watch Me tab without ending session
    router.replace('/screens/(main)/watchme' as any);
  });

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={
        <WatchMeHeader
          onBack={handleBack}
          title="Session details"
          subtitle="Your journey is being watched"
        />
      }
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <SessionInfoCard sessionStartedAt={sessionStartedAt} />

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ActiveWatchersList
            contacts={allContacts}
            sessionContactIds={localContactIds}
            onRemove={handleRemoveContact}
            onAddMore={handleAddMore}
          />
        </Animated.View>

        {/* Safety tip */}
        <Animated.View
          entering={FadeInDown.delay(360).springify()}
          className="rounded-2xl p-4 flex-row gap-3"
          style={{ backgroundColor: theme.surfaceBackground }}
        >
          <AppText className="text-xl">🛡️</AppText>
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark flex-1"
          >
            Your selected contacts can see your live location until you end this
            session. Stay safe!
          </AppText>
        </Animated.View>
      </ScrollView>

      {/* End session button */}
      <View
        className="absolute left-0 right-0 bottom-0 bg-white dark:bg-black px-6"
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      >
        <AppButton
          variant="primary"
          size="lg"
          className="w-full bg-accent-red dark:bg-accent-red-dark border-0"
          onPress={handleEndSession}
        >
          End session
        </AppButton>
      </View>
    </AppAnimatedSafeAreaView>
  );
}
