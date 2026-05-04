import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
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
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import {
  OnboardingFeatureRow,
  OnboardingFooter,
  WatchMeOnboardingHero,
  WATCH_ME_STEP_1_FEATURES,
  WATCH_ME_STEP_2_FEATURES,
} from '@/components/onboarding';

const WATCH_ME_PAGES = [
  { key: '1', features: WATCH_ME_STEP_1_FEATURES },
  { key: '2', features: WATCH_ME_STEP_2_FEATURES },
] as const;

export default function WatchMeOnboardingScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2>(1);
  const [pageW, setPageW] = useState(0);
  const listRef = useRef<FlatList<(typeof WATCH_ME_PAGES)[number]>>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  const setOnboardingDismissed = useWatchMeContactsStore(
    (s) => s.setOnboardingDismissedByUser
  );

  const handleDismiss = usePreventDoublePress(() => {
    setOnboardingDismissed(true);
    router.back();
  });

  const openContactsSheet = useWatchMeContactsSheetStore((s) => s.open);

  const onPagerLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setPageW(w);
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageW <= 0) return;
      const i = Math.round(e.nativeEvent.contentOffset.x / pageW);
      setStep(i === 0 ? 1 : 2);
    },
    [pageW]
  );

  useEffect(() => {
    if (pageW <= 0) return;
    listRef.current?.scrollToOffset({
      offset: (stepRef.current - 1) * pageW,
      animated: false,
    });
  }, [pageW]);

  const handleContinue = usePreventDoublePress(() => {
    if (step === 1) {
      if (pageW > 0) {
        listRef.current?.scrollToOffset({ offset: pageW, animated: true });
      } else {
        setStep(2);
      }
    } else {
      setTimeout(() => openContactsSheet(), 100);
    }
  });

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
      <View className="flex-1" onLayout={onPagerLayout}>
        {pageW > 0 ? (
          <FlatList
            ref={listRef}
            style={{ flex: 1 }}
            data={[...WATCH_ME_PAGES]}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(_, i) => ({
              length: pageW,
              offset: pageW * i,
              index: i,
            })}
            renderItem={({ item }) => (
              <ScrollView
                style={{ width: pageW, flexGrow: 0 }}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  paddingHorizontal: 24,
                  paddingBottom: insets.bottom + 150,
                }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                <View>
                  <WatchMeOnboardingHero />
                  {item.features.map((feature, index) => (
                    <OnboardingFeatureRow
                      key={feature.title}
                      feature={feature}
                      index={index}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          />
        ) : null}
      </View>

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
