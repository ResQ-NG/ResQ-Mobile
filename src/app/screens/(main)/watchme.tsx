import { useRef, useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ExpandedMapView } from '@/components/maps/ExpandedMapView';
import { WatchMeOverlay } from '@/components/watchme/WatchMeOverlay';
import { ACTIVE_WATCHES_MOCK } from '@/components/watchme/types';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';

export default function WatchMeScreen() {
  const resetLocation = useRef<(() => void) | null>(null);
  const [selectedWatchId, setSelectedWatchId] = useState<string | null>(null);
  const contacts = useWatchMeContactsStore((s) => s.contacts);
  const onboardingDismissedByUser = useWatchMeContactsStore(
    (s) => s.onboardingDismissedByUser
  );

  const shouldShowOnboarding = contacts.length === 0 && !onboardingDismissedByUser;

  useEffect(() => {
    if (shouldShowOnboarding) {
      router.push('/(modals)/watch-me-onboarding');
    }
  }, [shouldShowOnboarding]);

  const watchesOnMap = useMemo(
    () =>
      ACTIVE_WATCHES_MOCK.filter(
        (w) => w.availableOnMap && w.coordinates != null
      ).map((w) => ({
        id: w.id,
        name: w.name,
        avatarBgIndex: w.avatarBgIndex,
        coordinates: w.coordinates!,
      })),
    []
  );

  const handleResetLocation = () => {
    setSelectedWatchId(null);
    resetLocation.current?.();
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
        selectedWatchId={selectedWatchId}
        onSelectContact={(id) => setSelectedWatchId(id)}
        onCloseProfile={() => setSelectedWatchId(null)}
        onStartWatchMe={() => router.push('/(modals)/watch-me-onboarding')}
        onExpandPress={() => router.push('/screens/watch-me-contacts')}
        onResetLocation={handleResetLocation}
      />
    </View>
  );
}
