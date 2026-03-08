import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import {
  WatchMeHeader,
  StartWatchMeStep,
  type WatchMeContactGroup,
} from '@/components/watchme';

const MOCK_GROUPS: WatchMeContactGroup[] = [
  {
    id: 'family',
    name: 'Family members',
    contacts: [
      { id: '1', name: 'Mum', maskedPhone: '0803***4567', avatarBgIndex: 0 },
      { id: '2', name: 'Brother Tunde', maskedPhone: '0701***8901', avatarBgIndex: 1 },
    ],
  },
  {
    id: 'work',
    name: 'Work colleagues',
    contacts: [
      { id: '3', name: 'LizBee', maskedPhone: '0701***8901', avatarBgIndex: 2 },
    ],
  },
];

export default function StartWatchMeScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [estimatedArrival, setEstimatedArrival] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1', '2']));

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBack = () => router.back();
  const handleStartWatchMe = () => {
    // TODO: start watch me session, then router.back() or navigate to map
    router.back();
  };

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={<WatchMeHeader onBack={handleBack} />}
    >
      <StartWatchMeStep
        currentLocation={currentLocation}
        destination={destination}
        estimatedArrival={estimatedArrival}
        onCurrentLocationChange={setCurrentLocation}
        onDestinationChange={setDestination}
        onEstimatedArrivalChange={setEstimatedArrival}
        groups={MOCK_GROUPS}
        selectedIds={selectedIds}
        onToggleContact={toggleContact}
        onViewMorePress={() => {}}
        onStartPress={handleStartWatchMe}
        bottomInset={insets.bottom}
      />
    </AppAnimatedSafeAreaView>
  );
}
