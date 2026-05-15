import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { useAppColorScheme } from '@/theme/colorMode';
import { useRouteAnalysisStore } from '@/stores/route-analysis-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import {
  MOCK_ROUTES,
  MOCK_DESTINATION_EVENTS,
  MOCK_COMMUNITY_MEDIA,
} from '@/lib/mock/watchMeRouteSafetyMock';
import type { MockRoute } from '@/lib/mock/watchMeRouteSafetyMock';
import {
  SlideProgressDots,
  RoutesFoundSlide,
  RouteCardsSlide,
  RouteAnalyticsSlide,
  RouteMediaSlide,
  DestinationCheckSlide,
  RouteRecommendationSlide,
} from './components';
import {
  ROUTE_ANALYSIS_MOCK_DELAY_MS,
  ROUTE_SAFETY_INPUT_PHASE,
  ROUTE_SAFETY_LAST_SLIDE_INDEX,
  ROUTE_SAFETY_PAGER_COLORS,
  ROUTE_SAFETY_PAGER_ICONS,
  ROUTE_SAFETY_PAGER_OVERLAY,
  ROUTE_SAFETY_PAGER_SCROLL_THROTTLE_MS,
  ROUTE_SAFETY_SCREEN_WIDTH,
  ROUTE_SAFETY_SLIDE_PAGE_STYLE,
  ROUTE_SAFETY_SLIDE,
  ROUTE_SAFETY_SLIDE_COUNT,
  ROUTE_SAFETY_TOUCH,
} from './routeSafetyScreenConstants';

export default function RouteSafetyScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  const storeOrigin = useRouteAnalysisStore((s) => s.origin);
  const storeDestination = useRouteAnalysisStore((s) => s.destination);
  const setStoreOrigin = useRouteAnalysisStore((s) => s.setOrigin);
  const setStoreDestination = useRouteAnalysisStore((s) => s.setDestination);
  const setSelectedRoute = useRouteAnalysisStore((s) => s.setSelectedRoute);
  const setAnalysisComplete = useRouteAnalysisStore((s) => s.setAnalysisComplete);

  const [origin, setOrigin] = useState(storeOrigin);
  const [destination, setDestination] = useState(storeDestination);
  const [analysing, setAnalysing] = useState(false);
  const [showPager, setShowPager] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(ROUTE_SAFETY_SLIDE.ROUTES_FOUND);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    MOCK_ROUTES.find((r) => r.isRecommended)?.id ?? MOCK_ROUTES[0].id
  );

  const pagerRef = useRef<FlatList>(null);
  const recommendedRoute =
    MOCK_ROUTES.find((r) => r.isRecommended) ?? MOCK_ROUTES[0];
  const selectedRoute: MockRoute =
    MOCK_ROUTES.find((r) => r.id === selectedRouteId) ?? recommendedRoute;

  const handleBack = usePreventDoublePress(() => {
    if (showPager) {
      setShowPager(false);
      setCurrentSlide(ROUTE_SAFETY_SLIDE.ROUTES_FOUND);
    } else {
      router.back();
    }
  });

  const handleAnalyse = usePreventDoublePress(async () => {
    if (!destination.trim()) return;
    setAnalysing(true);
    setStoreOrigin(origin);
    setStoreDestination(destination);
    await new Promise((r) => setTimeout(r, ROUTE_ANALYSIS_MOCK_DELAY_MS));
    setAnalysing(false);
    setShowPager(true);
    setCurrentSlide(ROUTE_SAFETY_SLIDE.ROUTES_FOUND);
  });

  const handleSelectRoute = useCallback(
    (id: string) => {
      setSelectedRouteId(id);
      const route = MOCK_ROUTES.find((r) => r.id === id);
      if (route) setSelectedRoute(route);
    },
    [setSelectedRoute]
  );

  const scrollToSlide = (index: number) => {
    pagerRef.current?.scrollToIndex({ index, animated: true });
    setCurrentSlide(index);
  };

  const handleNextSlide = () => {
    if (currentSlide < ROUTE_SAFETY_LAST_SLIDE_INDEX) {
      scrollToSlide(currentSlide + 1);
    }
  };

  const goToWatchMe = usePreventDoublePress(() => {
    setSelectedRoute(selectedRoute);
    setAnalysisComplete(true);
    router.push('/screens/start-watch-me');
  });

  const handleContinueToWatchMe = goToWatchMe;
  const handleSkipToWatchMe = goToWatchMe;

  const isLastSlide = currentSlide === ROUTE_SAFETY_LAST_SLIDE_INDEX;

  const renderSlide = useCallback(
    ({ item }: { item: number }) => {
      switch (item) {
        case ROUTE_SAFETY_SLIDE.ROUTES_FOUND:
          return (
            <View style={ROUTE_SAFETY_SLIDE_PAGE_STYLE}>
              <RoutesFoundSlide
                origin={origin}
                destination={destination}
                routes={MOCK_ROUTES}
              />
            </View>
          );
        case ROUTE_SAFETY_SLIDE.ROUTE_CARDS:
          return (
            <View style={ROUTE_SAFETY_SLIDE_PAGE_STYLE}>
              <RouteCardsSlide
                routes={MOCK_ROUTES}
                selectedRouteId={selectedRouteId}
                origin={origin}
                destination={destination}
                onSelectRoute={handleSelectRoute}
              />
            </View>
          );
        case ROUTE_SAFETY_SLIDE.ANALYTICS:
          return (
            <View style={ROUTE_SAFETY_SLIDE_PAGE_STYLE}>
              <RouteAnalyticsSlide selectedRoute={selectedRoute} />
            </View>
          );
        case ROUTE_SAFETY_SLIDE.MEDIA:
          return (
            <View style={ROUTE_SAFETY_SLIDE_PAGE_STYLE}>
              <RouteMediaSlide items={MOCK_COMMUNITY_MEDIA} />
            </View>
          );
        case ROUTE_SAFETY_SLIDE.DESTINATION_CHECK:
          return (
            <View style={ROUTE_SAFETY_SLIDE_PAGE_STYLE}>
              <DestinationCheckSlide
                destination={destination}
                events={MOCK_DESTINATION_EVENTS}
              />
            </View>
          );
        case ROUTE_SAFETY_SLIDE.RECOMMENDATION:
          return (
            <View style={ROUTE_SAFETY_SLIDE_PAGE_STYLE}>
              <RouteRecommendationSlide
                recommendedRoute={recommendedRoute}
                destination={destination}
                onContinue={handleContinueToWatchMe}
              />
            </View>
          );
        default:
          return null;
      }
    },
    [
      origin,
      destination,
      selectedRouteId,
      selectedRoute,
      recommendedRoute,
      handleSelectRoute,
      handleContinueToWatchMe,
    ]
  );

  if (showPager) {
    const overlay = ROUTE_SAFETY_PAGER_OVERLAY;

    return (
      <View style={{ flex: 1, backgroundColor: ROUTE_SAFETY_PAGER_COLORS.background }}>
        <StatusBar barStyle="light-content" />

        <FlatList
          ref={pagerRef}
          data={Array.from({ length: ROUTE_SAFETY_SLIDE_COUNT }, (_, i) => i)}
          keyExtractor={(item) => String(item)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={ROUTE_SAFETY_PAGER_SCROLL_THROTTLE_MS}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / ROUTE_SAFETY_SCREEN_WIDTH
            );
            setCurrentSlide(index);
          }}
          renderItem={renderSlide}
          getItemLayout={(_, index) => ({
            length: ROUTE_SAFETY_SCREEN_WIDTH,
            offset: ROUTE_SAFETY_SCREEN_WIDTH * index,
            index,
          })}
        />

        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            paddingTop: insets.top + overlay.topInset,
            paddingHorizontal: overlay.horizontalPadding,
            gap: overlay.rowGap,
          }}
          pointerEvents="box-none"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={ROUTE_SAFETY_TOUCH.activeOpacity}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: overlay.closeButtonBg }}
              accessibilityLabel="Close analysis"
            >
              <Ionicons
                name="close"
                size={ROUTE_SAFETY_PAGER_ICONS.closeSize}
                color={ROUTE_SAFETY_PAGER_COLORS.iconOnDark}
              />
            </TouchableOpacity>

            <View className="flex-1 px-4">
              <SlideProgressDots
                total={ROUTE_SAFETY_SLIDE_COUNT}
                current={currentSlide}
              />
            </View>

            <View className="w-10" />
          </View>
        </View>

        {!isLastSlide ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: insets.bottom + overlay.footerBottomInset,
              paddingHorizontal: overlay.horizontalPadding,
              gap: overlay.footerButtonGap,
            }}
            pointerEvents="box-none"
          >
            <AppButton
              variant="primary"
              size="lg"
              className="w-full"
              onPress={handleNextSlide}
              accessibilityLabel="Next slide"
            >
              Next
            </AppButton>
            <AppButton
              variant="secondary"
              size="lg"
              className="w-full bg-white/12 border border-white/15"
              labelClassName="text-white"
              onPress={handleSkipToWatchMe}
              accessibilityLabel="Skip to Watch Me"
            >
              Skip to Watch Me
            </AppButton>
          </View>
        ) : null}
      </View>
    );
  }

  const inputPhase = ROUTE_SAFETY_INPUT_PHASE;

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
    >
      <View className="py-2 pb-4">
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={ROUTE_SAFETY_TOUCH.activeOpacity}
          className="w-10 h-10 rounded-full items-center justify-center border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] bg-white dark:bg-[#1a1a1a] mb-3"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={ROUTE_SAFETY_PAGER_ICONS.closeSize}
            color={theme.textMuted}
          />
        </TouchableOpacity>
        <AppText className="text-primaryDark dark:text-primaryDark-dark font-metropolis-bold text-2xl">
          Route safety
        </AppText>
        <AppText
          variant="caption"
          className="text-captionDark dark:text-captionDark-dark mt-1"
        >
          Analyse your route before heading out.
        </AppText>
      </View>

      <View className="flex-1 mt-4 gap-4">
        <View className="gap-1">
          <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark mb-2">
            From
          </AppText>
          <AppInput
            value={origin}
            onChangeText={setOrigin}
            placeholder="Your starting point (optional)"
            leftIcon={
              <Ionicons
                name="radio-button-on"
                size={inputPhase.inputIconSize}
                color={theme.textMuted}
              />
            }
          />
        </View>

        <View className="gap-1">
          <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark mb-2">
            To
          </AppText>
          <AppInput
            value={destination}
            onChangeText={setDestination}
            placeholder="Where are you going?"
            leftIcon={
              <Ionicons
                name="location"
                size={inputPhase.inputIconSize}
                color={theme.primaryBlue}
              />
            }
          />
        </View>

        <View
          className="rounded-2xl p-4 flex-row gap-3"
          style={{ backgroundColor: theme.surfaceBackground }}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={inputPhase.calloutIconSize}
            color={theme.primaryBlue}
          />
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark flex-1"
          >
            We will identify available routes, analyse safety conditions, and
            check for recent events near your destination in the last 24 hours.
          </AppText>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + inputPhase.footerBottomInset,
        }}
        pointerEvents="box-none"
      >
        <AppButton
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!destination.trim() || analysing}
          loading={analysing}
          onPress={handleAnalyse}
        >
          {analysing ? 'Analysing your route...' : 'Analyse route'}
        </AppButton>
      </View>
    </AppAnimatedSafeAreaView>
  );
}
