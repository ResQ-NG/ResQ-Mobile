import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { useAppColorScheme } from '@/theme/colorMode';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import {
  OnboardingFeatureRow,
  OnboardingFooter,
  WatchMeOnboardingHero,
  WATCH_ME_STEP_1_FEATURES,
  WATCH_ME_STEP_2_FEATURES,
} from '@/components/onboarding';

export default function WatchMeOnboardingScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2>(1);

  const setOnboardingDismissed = useWatchMeContactsStore(
    (s) => s.setOnboardingDismissedByUser
  );

  const handleDismiss = () => {
    setOnboardingDismissed(true);
    router.back();
  };

  const openContactsSheet = useWatchMeContactsSheetStore((s) => s.open);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setTimeout(() => openContactsSheet(), 100);
    }
  };

  const features =
    step === 1 ? WATCH_ME_STEP_1_FEATURES : WATCH_ME_STEP_2_FEATURES;

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
            onPress={handleDismiss}
            icon={
              <SolarArrowLeftBrokenIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
            className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
            accessibilityLabel="Close"
          />
          <View style={{ width: 44, height: 44 }} />
        </AppAnimatedView>
      }
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',

          paddingBottom: insets.bottom + 150,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <WatchMeOnboardingHero />
          {features.map((feature, index) => (
            <OnboardingFeatureRow
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </View>
      </ScrollView>

      <View
        className={`absolute left-0 right-0 bottom-0 ${theme.background}`}
        style={{ paddingBottom: insets.bottom }}
      >
        <OnboardingFooter
          onContinue={handleContinue}
          continueLabel={step === 1 ? 'Continue' : 'Get started'}
          hideLegal
        />
      </View>
    </AppAnimatedSafeAreaView>
  );
}
