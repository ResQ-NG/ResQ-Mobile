import {
  AppAnimatedSafeAreaView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { useAppColorScheme } from '@/theme/colorMode';
import { WatchMeOnboardingInboundPeers } from '@/components/watchme/WatchMeOnboardingInboundPeers';
import { WatchMeOnboardingSlides } from '@/components/watchme/WatchMeOnboardingSlides';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useState } from 'react';
import { useViewInboundPeers } from '@/network/modules/emergency-contacts/queries';

export default function WatchMeOnboardingScreen() {
  const { theme } = useAppColorScheme();
  const [phase, setPhase] = useState<'slides' | 'peers'>('slides');

  const { data: inboundData, isLoading: inboundLoading } = useViewInboundPeers();
  const inboundPeers = inboundData?.peers ?? [];

  const setOnboardingDismissed = useWatchMeContactsStore(
    (s) => s.setOnboardingDismissedByUser
  );

  const handleDismiss = usePreventDoublePress(() => {
    setOnboardingDismissed(true);
    router.back();
  });

  const openContactsSheet = useWatchMeContactsSheetStore((s) => s.open);

  const handleHeaderBack = usePreventDoublePress(() => {
    if (phase === 'peers') {
      setPhase('slides');
      return;
    }
    handleDismiss();
  });

  const openContactsSheetDelayed = () => {
    setTimeout(() => openContactsSheet(), 100);
  };

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="md"
      header={
        <AppAnimatedView
          entering={brandFadeIn}
          className="flex-row items-center justify-between py-2"
        >
          <RoundedButton
            onPress={handleHeaderBack}
            icon={
              <SolarArrowLeftBrokenIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
            className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
            accessibilityLabel={phase === 'peers' ? 'Back' : 'Close'}
          />
          <View style={{ width: 44, height: 44 }} />
        </AppAnimatedView>
      }
    >
      {phase === 'slides' ? (
        <WatchMeOnboardingSlides
          inboundLoading={inboundLoading}
          hasInboundPeers={inboundPeers.length > 0}
          onContinueToInboundPeers={() => setPhase('peers')}
          onContinueToContactsSheet={openContactsSheetDelayed}
        />
      ) : (
        <WatchMeOnboardingInboundPeers
          peers={inboundPeers}
          inboundLoading={inboundLoading}
          onAddSomeoneElse={openContactsSheetDelayed}
          onSkip={handleDismiss}
        />
      )}
    </AppAnimatedSafeAreaView>
  );
}
