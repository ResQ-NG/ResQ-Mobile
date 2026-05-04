import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import {
  OnboardingProgressBar,
  OnboardingHero,
  OnboardingFeatureRow,
  OnboardingFooter,
  STEP_1_FEATURES,
  STEP_2_FEATURES,
} from '@/components/onboarding';
import { useAppColorScheme } from '@/theme/colorMode';

const WELCOME_PAGES = [
  { key: '1', features: STEP_1_FEATURES },
  { key: '2', features: STEP_2_FEATURES },
] as const;

export default function WelcomeScreen() {
  const [step, setStep] = useState<1 | 2>(1);
  const [pageW, setPageW] = useState(0);
  const progressWidth = useSharedValue('50%');
  const { theme } = useAppColorScheme();
  const listRef = useRef<FlatList<(typeof WELCOME_PAGES)[number]>>(null);
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
    progressWidth.value = withTiming(step === 1 ? '50%' : '100%', { duration: 400 });
  }, [step, progressWidth]);

  useEffect(() => {
    if (pageW <= 0) return;
    listRef.current?.scrollToOffset({
      offset: (stepRef.current - 1) * pageW,
      animated: false,
    });
  }, [pageW]);

  const handleContinue = () => {
    if (step === 1) {
      if (pageW > 0) {
        listRef.current?.scrollToOffset({ offset: pageW, animated: true });
      } else {
        setStep(2);
      }
    } else {
      router.replace('/screens/(onboarding)/get-started');
    }
  };

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="md"
    >
      <OnboardingProgressBar progressWidth={progressWidth} />

      <View className="flex-1" onLayout={onPagerLayout}>
        {pageW > 0 ? (
          <FlatList
            ref={listRef}
            style={{ flex: 1 }}
            data={[...WELCOME_PAGES]}
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
                  paddingVertical: 24,
                  paddingHorizontal: 24,
                }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                <View>
                  <OnboardingHero />
                  {item.features.map((feature, index) => (
                    <OnboardingFeatureRow key={feature.title} feature={feature} index={index} />
                  ))}
                </View>
              </ScrollView>
            )}
          />
        ) : null}
      </View>

      <OnboardingFooter onContinue={handleContinue} />
      <StatusBar style={theme.statusBarStyle} />
    </AppAnimatedSafeAreaView>
  );
}
