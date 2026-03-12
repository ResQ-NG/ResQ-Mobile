import { useRef, useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ExpandedMapView } from '@/components/maps/ExpandedMapView';
import { WatchMeOverlay } from '@/components/watchme/WatchMeOverlay';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useActiveWatches } from '@/hooks/useActiveWatches';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';

export default function WatchMeScreen() {
  const resetLocation = useRef<(() => void) | null>(null);
  const [selectedWatchId, setSelectedWatchId] = useState<string | null>(null);
  const contacts = useWatchMeContactsStore((s) => s.contacts);
  const onboardingDismissedByUser = useWatchMeContactsStore(
    (s) => s.onboardingDismissedByUser
  );
  const openContactsSheet = useWatchMeContactsSheetStore((s) => s.open);
  const activeWatches = useActiveWatches();

  const shouldShowOnboarding =
    contacts.length === 0 && !onboardingDismissedByUser;

  useEffect(() => {
    if (shouldShowOnboarding) {
      router.push('/(modals)/watch-me-onboarding');
    }
  }, [shouldShowOnboarding]);

  const handleStartWatchMe = () => {
    if (shouldShowOnboarding) {
      router.push('/(modals)/watch-me-onboarding');
    } else {
      router.push('/screens/start-watch-me');
    }
  };

  const watchesOnMap = useMemo(
    () =>
      activeWatches
        .filter((w) => w.availableOnMap && w.coordinates != null)
        .map((w) => ({
          id: w.id,
          name: w.name,
          avatarBgIndex: w.avatarBgIndex,
          coordinates: w.coordinates!,
        })),
    [activeWatches]
  );

  const handleResetLocation = () => {
    setSelectedWatchId(null);
    resetLocation.current?.();
  };

  const handleSearchSafety = () => {
    router.push('/screens/check-safety');
  };

  if (shouldShowOnboarding) {
    return null;
  }

  return (
    <View className="flex-1">
      <ExpandedMapView
        resetLocation={resetLocation}
        watchesOnMap={watchesOnMap}
        focusedWatchId={selectedWatchId}
      />
      <WatchMeOverlay
        watches={activeWatches}
        selectedWatchId={selectedWatchId}
        onSelectContact={(id) => setSelectedWatchId(id)}
        onCloseProfile={() => setSelectedWatchId(null)}
        onStartWatchMe={() => handleStartWatchMe()}
        onExpandPress={openContactsSheet}
        onResetLocation={handleResetLocation}
        onSosPress={() => router.push('/screens/report-management')}
        onSearchPress={handleSearchSafety}
      />
    </View>
  );
}
