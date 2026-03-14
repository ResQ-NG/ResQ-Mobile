import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { WatchMeHeader } from '@/components/watchme';
import {
  StartWatchMeStep,
  type TransportationMode,
} from './components';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useWatchMeContactGroups } from '@/hooks/useWatchMeContactGroups';
import { useRouteSafetyCheck } from '@/hooks/useRouteSafetyCheck';
import { useUnsafeRouteSheetStore } from '@/stores/unsafe-route-sheet-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

const SUCCESS_MESSAGE_DURATION_MS = 600;

export default function StartWatchMeScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const groups = useWatchMeContactGroups();
  const { checkRouteSafety, hideModal } = useRouteSafetyCheck();
  const openRouteSafetyStatusSheet = useUnsafeRouteSheetStore((s) => s.open);

  const [destination, setDestination] = useState('');
  const [transportation, setTransportation] = useState<TransportationMode | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isChecking, setIsChecking] = useState(false);

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setSessionActive = useWatchMeContactsStore((s) => s.setSessionActive);

  const handleBack = usePreventDoublePress(() => router.back());
  const handleStartWatchMe = usePreventDoublePress(async () => {
    if (isChecking) return;
    setIsChecking(true);
    try {
      const { safe, issues } = await checkRouteSafety(destination);
      await new Promise((r) => setTimeout(r, SUCCESS_MESSAGE_DURATION_MS));
      hideModal();

      openRouteSafetyStatusSheet({
        fromLabel: 'Current location',
        toLabel: destination || 'Destination',
        issues: issues ?? [],
      });

      if (safe) {
        setSessionActive(true);
        router.back();
      }
    } finally {
      setIsChecking(false);
    }
  });

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={<WatchMeHeader onBack={handleBack} />}
    >
      <StartWatchMeStep
        destination={destination}
        onDestinationChange={setDestination}
        transportation={transportation}
        onTransportationChange={setTransportation}
        groups={groups}
        selectedIds={selectedIds}
        onToggleContact={toggleContact}
        onViewMorePress={() => {}}
        onStartPress={handleStartWatchMe}
        isStarting={isChecking}
        bottomInset={insets.bottom}
      />
    </AppAnimatedSafeAreaView>
  );
}
