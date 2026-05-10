import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedScrollView } from '@/lib/animation';
import {
  OnboardingFeatureRow,
  OnboardingFooter,
  WatchMeOnboardingHero,
  WATCH_ME_STEP_1_FEATURES,
  WATCH_ME_STEP_2_FEATURES,
} from '@/components/onboarding';
import { useAppColorScheme } from '@/theme/colorMode';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

const WATCH_ME_PAGES = [
  { key: '1', features: WATCH_ME_STEP_1_FEATURES },
  { key: '2', features: WATCH_ME_STEP_2_FEATURES },
] as const;

type Props = {
  inboundLoading: boolean;
  hasInboundPeers: boolean;
  onContinueToInboundPeers: () => void;
  onContinueToContactsSheet: () => void;
};

export function WatchMeOnboardingSlides({
  inboundLoading,
  hasInboundPeers,
  onContinueToInboundPeers,
  onContinueToContactsSheet,
}: Props) {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2>(1);
  const [pageW, setPageW] = useState(0);
  const listRef = useRef<FlatList<(typeof WATCH_ME_PAGES)[number]>>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

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
    } else if (inboundLoading) {
      return;
    } else if (hasInboundPeers) {
      onContinueToInboundPeers();
    } else {
      onContinueToContactsSheet();
    }
  });

  return (
    <>
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
              <AppAnimatedScrollView
                style={{ width: pageW, flexGrow: 0 }}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  paddingBottom: insets.bottom + 30,
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
              </AppAnimatedScrollView>
            )}
          />
        ) : null}
      </View>

      <View
        className={`absolute bottom-0 left-0 right-0 ${theme.background}`}
        style={{ paddingBottom: insets.bottom }}
      >
        <OnboardingFooter
          onContinue={handleContinue}
          continueLabel={step === 1 ? 'Continue' : 'Get started'}
          hideLegal
          continueDisabled={step === 2 && inboundLoading}
          continueLoading={step === 2 && inboundLoading}
        />
      </View>
    </>
  );
}
