import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FlatList, Linking, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { useAppColorScheme } from '@/theme/colorMode';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import {
  OnboardingFeatureRow,
  OnboardingFooter,
} from '@/components/onboarding';
import type { HowToUseStep } from '@/components/help/howToUseAppData';
import { HOW_TO_USE_APP_STEPS } from '@/components/help/howToUseAppData';
import SolarPlayStreamBoldIcon from '@/components/icons/solar/play-stream-bold';
import { useAppHelpIntroStore } from '@/stores/app-help-intro-store';
// import { HowToUseSlideHero } from '@/components/help/HowToUseSlideHero';
import { cn } from '@/lib/cn';

const TOTAL = HOW_TO_USE_APP_STEPS.length;

export default function HowToUseAppModal() {
  const navigation = useNavigation();
  const markAppHelpIntroCompleted = useAppHelpIntroStore(
    (s) => s.markAppHelpIntroCompleted
  );
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const listRef = useRef<FlatList<HowToUseStep>>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  const handleClose = usePreventDoublePress(() => router.back());

  const goToPage = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(TOTAL - 1, i));
      setIndex(clamped);
      if (pageWidth > 0) {
        listRef.current?.scrollToOffset({
          offset: clamped * pageWidth,
          animated: true,
        });
      }
    },
    [pageWidth]
  );

  const onPagerLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setPageWidth(w);
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.min(TOTAL - 1, Math.max(0, Math.round(x / pageWidth)));
      setIndex(next);
    },
    [pageWidth]
  );

  useEffect(() => {
    if (pageWidth <= 0) return;
    listRef.current?.scrollToOffset({
      offset: indexRef.current * pageWidth,
      animated: false,
    });
  }, [pageWidth]);

  const handleContinue = usePreventDoublePress(() => {
    if (index < TOTAL - 1) {
      goToPage(index + 1);
    } else {
      router.back();
    }
  });

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', () => {
      markAppHelpIntroCompleted();
    });
    return unsub;
  }, [navigation, markAppHelpIntroCompleted]);

  const continueLabel = useMemo(
    () => (index < TOTAL - 1 ? 'Next' : 'Done'),
    [index]
  );

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
            onPress={handleClose}
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
      <View className="flex-1 pt-4" onLayout={onPagerLayout}>
        <View className="mb-8 flex-row items-center justify-center gap-2 px-6">
          {HOW_TO_USE_APP_STEPS.map((s, i) => (
            <Pressable
              key={s.label}
              onPress={() => goToPage(i)}
              accessibilityRole="button"
              accessibilityLabel={`${s.label}, step ${i + 1} of ${TOTAL}`}
              className="items-center"
            >
              <View
                className={cn(
                  'h-2 rounded-full',
                  i === index
                    ? 'w-8 bg-primary-blue dark:bg-primary-blue-dark'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                )}
              />
            </Pressable>
          ))}
        </View>

        {pageWidth > 0 ? (
          <FlatList
            ref={listRef}
            style={{ flex: 1 }}
            data={HOW_TO_USE_APP_STEPS}
            keyExtractor={(s) => s.label}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(_, i) => ({
              length: pageWidth,
              offset: pageWidth * i,
              index: i,
            })}
            renderItem={({ item: step }) => (
              <ScrollView
                style={{ width: pageWidth, flexGrow: 0 }}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 24,
                  paddingBottom: insets.bottom + 160,
                }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                <AppAnimatedView entering={brandFadeIn} key={step.title}>
                  {/* Illustration + stat hero — re-enable when ready
                  <HowToUseSlideHero
                    Icon={step.hero.Icon}
                    stats={step.stats}
                    gradientLight={step.hero.gradientLight}
                    gradientDark={step.hero.gradientDark}
                    isDark={false}
                    iconColor={
                      step.hero.iconVariant === 'accent'
                        ? theme.accentRed
                        : theme.primaryBlue
                    }
                  />
                  */}
                  <AppText
                    variant="caption"
                    className="mb-2 font-metropolis-semibold uppercase tracking-wide text-primary-blue dark:text-primary-blue-dark"
                  >
                    {step.label}
                  </AppText>
                  <AppHeading level={2} className="mb-2">
                    {step.title}
                  </AppHeading>
                  <AppText
                    variant="body"
                    className="mb-8 text-captionDark dark:text-captionDark-dark"
                  >
                    {step.subtitle}
                  </AppText>

                  {step.features.map((feature, i) => (
                    <OnboardingFeatureRow
                      key={`${step.title}-${feature.title}`}
                      feature={feature}
                      index={i}
                    />
                  ))}

                  {step.relatedVideos?.length ? (
                    <View className="mt-6 border-t border-gray-200/90 pt-5 dark:border-gray-700/90">
                      <AppText
                        variant="caption"
                        className="mb-1 text-captionDark dark:text-captionDark-dark"
                      >
                        Popular videos around this
                      </AppText>
                      {step.relatedVideos.map((v, vi) => (
                        <Pressable
                          key={`${v.url}-${vi}`}
                          onPress={() => void Linking.openURL(v.url)}
                          accessibilityRole="link"
                          accessibilityLabel={`Open video: ${v.label}`}
                          className="flex-row items-center gap-3 py-2.5 active:opacity-70"
                        >
                          <View className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark">
                            <SolarPlayStreamBoldIcon
                              width={22}
                              height={22}
                              color={theme.primaryBlue}
                            />
                          </View>
                          <AppText className="flex-1 text-[15px] leading-snug text-primary-blue dark:text-primary-blue-dark">
                            {v.label}
                          </AppText>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </AppAnimatedView>
              </ScrollView>
            )}
          />
        ) : null}
      </View>

      <View className={`absolute left-0 right-0 bottom-0 ${theme.background}`}>
        <OnboardingFooter
          onContinue={handleContinue}
          continueLabel={continueLabel}
          hideLegal
        />
      </View>
    </AppAnimatedSafeAreaView>
  );
}
