import { useRef, useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ExpandedMapView } from '@/components/maps/ExpandedMapView';
import { WatchMeOverlay } from '@/components/watchme/WatchMeOverlay';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useActiveWatches } from '@/hooks/useActiveWatches';
import { useSosConfirmSheetStore } from '@/stores/sos-confirm-sheet-store';
import { useAppModalStore } from '@/stores/app-modal-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useUserLocationStore } from '@/stores/user-location-store';

const SOS_LOADING_DURATION_MS = 1200;

export default function WatchMeScreen() {
  const locationLabel = useUserLocationStore((s) => s.addressLabel);
  const resetLocation = useRef<(() => void) | null>(null);
  const [selectedWatchId, setSelectedWatchId] = useState<string | null>(null);
  const contacts = useWatchMeContactsStore((s) => s.contacts);
  const onboardingDismissedByUser = useWatchMeContactsStore(
    (s) => s.onboardingDismissedByUser
  );
  const navigateToContacts = usePreventDoublePress(() =>
    router.push('/screens/start-watch-me/contacts')
  );
  const openSosConfirmSheet = useSosConfirmSheetStore((s) => s.open);
  const { showLoading, setProgress, hide: hideAppModal } = useAppModalStore();
  const handleSosPress = usePreventDoublePress(openSosConfirmSheet);
  const handleSosLongPress = usePreventDoublePress(() => {
    showLoading({ message: 'Starting Watch Me session...', progress: 0 });
    setTimeout(() => setProgress(40), 400);
    setTimeout(() => setProgress(80), 800);
    setTimeout(() => {
      setProgress(100);
      router.push('/screens/sos');
      hideAppModal();
    }, SOS_LOADING_DURATION_MS);
  });
  const activeWatches = useActiveWatches();

  const shouldShowOnboarding =
    contacts.length === 0 && !onboardingDismissedByUser;

  useEffect(() => {
    if (shouldShowOnboarding) {
      router.push('/(modals)/watch-me-onboarding');
    }
  }, [shouldShowOnboarding]);

  const handleStartWatchMe = usePreventDoublePress(() => {
    if (shouldShowOnboarding) {
      router.push('/(modals)/watch-me-onboarding');
    } else {
      router.push('/screens/start-watch-me');
    }
  });

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

  const handleSearchSafety = usePreventDoublePress(() => {
    router.push('/screens/check-safety');
  });

  const handleSelectContact = usePreventDoublePress((id: string) => {
    router.push({ pathname: '/(modals)/watch-me-status', params: { id } });
  });

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
        location={locationLabel}
        watches={activeWatches}
        selectedWatchId={selectedWatchId}
        onSelectContact={handleSelectContact}
        onCloseProfile={() => setSelectedWatchId(null)}
        onStartWatchMe={() => handleStartWatchMe()}
        onExpandPress={navigateToContacts}
        onResetLocation={handleResetLocation}
        onSosPress={handleSosPress}
        onSosLongPress={handleSosLongPress}
        onSearchPress={handleSearchSafety}
      />
    </View>
  );
}
