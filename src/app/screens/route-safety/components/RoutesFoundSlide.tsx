import { useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AppAnimatedText,
  AppAnimatedView,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import SolarMapArrowRightBoldIcon from '@/components/icons/solar/map-arrow-right-bold';
import { SlideBackgroundDecor, SLIDE_BG_ICON_SIZE } from './SlideBackgroundDecor';
import { SlideBrandLabel } from './SlideBrandLabel';
import { PagerSlideContent } from './pagerSlideInsets';
import { slideLabel, slideHeadline, slideBody, slideCta } from './SlideAnimations';
import type { MockRoute } from '@/lib/mock/watchMeRouteSafetyMock';

interface RoutesFoundSlideProps {
  origin: string;
  destination: string;
  routes: MockRoute[];
}

export function RoutesFoundSlide({
  origin,
  destination,
  routes,
}: RoutesFoundSlideProps) {
  const counterValue = useSharedValue(0);

  useEffect(() => {
    counterValue.value = withDelay(
      400,
      withSpring(routes.length, { damping: 9, stiffness: 55 })
    );
  }, [counterValue, routes.length]);

  const animatedCounterStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, counterValue.value / (routes.length * 0.6)),
    transform: [
      {
        scale: 0.5 + (counterValue.value / routes.length) * 0.5,
      },
    ],
  }));

  return (
    <LinearGradient
      colors={['#1e0b52', '#3730a3', '#6d28d9']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={{ flex: 1 }}
    >
      <SlideBackgroundDecor
        name="map"
        tint="primary"
        size={SLIDE_BG_ICON_SIZE.primary}
        style={{ top: 48, right: -24 }}
      />
      <SlideBackgroundDecor
        name="navigate"
        tint="success"
        size={SLIDE_BG_ICON_SIZE.secondary}
        delay={140}
        style={{ bottom: 72, left: -20 }}
      />

      <PagerSlideContent>
        <AppAnimatedView className="flex-1 px-8">
          <SlideBrandLabel label="ROUTE ANALYSIS" />

          <AppAnimatedView className="flex-1 items-center justify-center pt-4">
            <AppAnimatedView
              entering={slideLabel}
              className="flex-row items-center gap-2 mb-8"
            >
              <AppText
                style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, fontWeight: '500' }}
                numberOfLines={1}
              >
                {origin || 'Your location'}
              </AppText>
              <SolarMapArrowRightBoldIcon width={14} height={14} color="rgba(255,255,255,0.5)" />
              <AppText
                style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, fontWeight: '500' }}
                numberOfLines={1}
              >
                {destination}
              </AppText>
            </AppAnimatedView>

            <View className="items-center mb-4">
              <AppAnimatedText
                style={[
                  {
                    fontSize: 112,
                    fontWeight: '900',
                    color: '#ffffff',
                    lineHeight: 118,
                    includeFontPadding: false,
                  },
                  animatedCounterStyle,
                ]}
              >
                {routes.length}
              </AppAnimatedText>
            </View>

            <AppAnimatedText
              entering={slideHeadline}
              style={{
                color: '#fff',
                fontSize: 32,
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              routes identified
            </AppAnimatedText>

            <AppAnimatedText
              entering={slideBody}
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 15,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              We analysed your journey and found {routes.length} possible paths. Swipe to explore
              each one.
            </AppAnimatedText>

            <AppAnimatedView
              entering={slideCta}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 8,
                marginTop: 32,
              }}
            >
              {routes.map((r) => (
                <View
                  key={r.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: r.accentColor + '22',
                    borderWidth: 1,
                    borderColor: r.accentColor + '55',
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: r.accentColor,
                    }}
                  />
                  <AppText style={{ color: '#fff', fontSize: 11, fontWeight: '500' }}>
                    {r.via}
                  </AppText>
                </View>
              ))}
            </AppAnimatedView>
          </AppAnimatedView>
        </AppAnimatedView>
      </PagerSlideContent>
    </LinearGradient>
  );
}
