import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { WatchMeHeader } from '@/components/watchme';
import { CheckSafetyStep } from '@/components/watchme/CheckSafetyStep';
import { useRouteSafetyCheck } from '@/hooks/useRouteSafetyCheck';
import { useUnsafeRouteSheetStore } from '@/stores/unsafe-route-sheet-store';

const SUCCESS_MESSAGE_DURATION_MS = 600;

export default function CheckSafetyScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const { checkRouteSafety, hideModal } = useRouteSafetyCheck();
  const openRouteSafetyStatusSheet = useUnsafeRouteSheetStore((s) => s.open);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [canStartWatchMe, setCanStartWatchMe] = useState(false);

  const handleBack = () => router.back();

  const handleCheckSafety = async () => {
    if (isChecking || !destination) return;
    setIsChecking(true);
    try {
      const { safe, issues } = await checkRouteSafety(destination);
      await new Promise((r) => setTimeout(r, SUCCESS_MESSAGE_DURATION_MS));
      hideModal();

      openRouteSafetyStatusSheet({
        fromLabel: origin || 'Origin',
        toLabel: destination || 'Destination',
        issues: issues ?? [],
      });

      setCanStartWatchMe(safe);
    } finally {
      setIsChecking(false);
    }
  };

  const handleStartWatchMeFromHere = () => {
    router.push('/screens/start-watch-me');
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    setCanStartWatchMe(false);
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    setCanStartWatchMe(false);
  };

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={
        <WatchMeHeader
          onBack={handleBack}
          title="Check safety"
          subtitle="See how safe a route looks before you go."
        />
      }
    >
      <CheckSafetyStep
        origin={origin}
        destination={destination}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        onCheckPress={handleCheckSafety}
        onStartWatchMePress={handleStartWatchMeFromHere}
        canStartWatchMe={canStartWatchMe}
        isChecking={isChecking}
        bottomInset={insets.bottom}
      />
    </AppAnimatedSafeAreaView>
  );
}

