import { useCallback, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { WatchMeHeader } from '@/components/watchme';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { useWatchMeContactGroups } from '@/network/modules/watch-me/hooks/useWatchMeContactGroups';
import { useRouteAnalysisStore } from '@/stores/route-analysis-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { StartWatchMeStep, type TransportationMode } from './components';

export default function StartWatchMeScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const groups = useWatchMeContactGroups();
  const openAddContactSheet = useWatchMeContactsSheetStore((s) => s.openForAdd);

  const destination = useRouteAnalysisStore((s) => s.destination);
  const selectedRoute = useRouteAnalysisStore((s) => s.selectedRoute);

  const startSession = useWatchMeContactsStore((s) => s.startSession);

  const [transportation, setTransportation] =
    useState<TransportationMode | null>(selectedRoute ? 'driving' : null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRelationshipGroup = useCallback(
    (groupId: string) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group || group.contacts.length === 0) return;
      setSelectedIds((prev) => {
        const next = new Set(prev);
        const allInGroup = group.contacts.every((c) => next.has(c.id));
        if (allInGroup) {
          for (const c of group.contacts) next.delete(c.id);
        } else {
          for (const c of group.contacts) next.add(c.id);
        }
        return next;
      });
    },
    [groups]
  );

  const handleToggleRelationshipGroup = usePreventDoublePress(
    toggleRelationshipGroup
  );

  const handleBack = usePreventDoublePress(() => router.back());
  const handleAddContactPress = usePreventDoublePress(openAddContactSheet);

  const handleStartWatchMe = usePreventDoublePress(() => {
    startSession([...selectedIds]);
    router.replace('/screens/watch-me-session');
  });

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={
        <WatchMeHeader
          onBack={handleBack}
          title="Watch me"
          subtitle={
            destination
              ? `Heading to ${destination}`
              : 'Let loved ones track your journey'
          }
        />
      }
    >
      <StartWatchMeStep
        destination={destination}
        selectedRoute={selectedRoute}
        transportation={transportation}
        onTransportationChange={setTransportation}
        groups={groups}
        selectedIds={selectedIds}
        onToggleContact={toggleContact}
        onToggleRelationshipGroup={handleToggleRelationshipGroup}
        onAddContactPress={handleAddContactPress}
        onStartPress={handleStartWatchMe}
        bottomInset={insets.bottom}
      />
    </AppAnimatedSafeAreaView>
  );
}
