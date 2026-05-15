import { LinearGradient } from 'expo-linear-gradient';
import {
  AppAnimatedText,
  AppAnimatedView,
  FadeInDown,
  ZoomIn,
} from '@/lib/animation';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import type { MockRoute } from '@/lib/mock/watchMeRouteSafetyMock';
import { SlideBackgroundDecor, SLIDE_BG_ICON_SIZE } from './SlideBackgroundDecor';
import { PagerSlideContent } from './pagerSlideInsets';

interface RouteRecommendationSlideProps {
  recommendedRoute: MockRoute;
  destination: string;
  onContinue: () => void;
}

export function RouteRecommendationSlide({
  recommendedRoute,
  destination,
  onContinue,
}: RouteRecommendationSlideProps) {
  return (
    <LinearGradient
      colors={['#052e16', '#14532d', '#052e16']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SlideBackgroundDecor
        name="checkmark-circle"
        tint="success"
        size={SLIDE_BG_ICON_SIZE.primary}
        style={{ top: 40, right: -24 }}
      />
      <SlideBackgroundDecor
        name="star"
        tint="primary"
        size={SLIDE_BG_ICON_SIZE.secondary}
        delay={140}
        style={{ bottom: 72, left: -20 }}
      />
      <PagerSlideContent lastSlide className="flex-1 px-6 items-center justify-center">
        <AppAnimatedView
          entering={ZoomIn.delay(100).springify()}
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(34,197,94,0.2)' }}
        >
          <Ionicons name="checkmark-circle" size={52} color="#22c55e" />
        </AppAnimatedView>

        <AppAnimatedText
          entering={FadeInDown.delay(300).springify()}
          className="text-white/60 text-base font-metropolis-medium text-center mb-2"
        >
          Our recommendation
        </AppAnimatedText>

        <AppAnimatedText
          entering={FadeInDown.delay(440).springify()}
          className="text-white text-4xl font-metropolis-bold text-center mb-2"
        >
          {recommendedRoute.label}
        </AppAnimatedText>

        <AppAnimatedText
          entering={FadeInDown.delay(560).springify()}
          className="text-green-300 text-lg font-metropolis-semibold text-center mb-1"
        >
          {recommendedRoute.via}
        </AppAnimatedText>

        <AppAnimatedText
          entering={FadeInDown.delay(640).springify()}
          className="text-white/50 text-sm font-metropolis-regular text-center mb-10"
        >
          {recommendedRoute.distanceKm} km · {recommendedRoute.durationMin} min · Safety score{' '}
          {recommendedRoute.safetyScore}/100
        </AppAnimatedText>

        <AppAnimatedView
          entering={FadeInDown.delay(800).springify()}
          className="w-full rounded-2xl p-4 mb-8"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <AppText className="text-white/80 text-sm font-metropolis-regular text-center">
            This route has the highest safety score and the most completed Watch Me trips to{' '}
            <AppText className="text-white font-metropolis-semibold">{destination}</AppText>.
          </AppText>
        </AppAnimatedView>

        <AppAnimatedView entering={FadeInDown.delay(960).springify()} className="w-full">
          <AppButton
            variant="primary"
            size="lg"
            className="w-full"
            style={{ backgroundColor: '#22c55e', borderWidth: 0 }}
            onPress={onContinue}
          >
            Continue to Watch Me
          </AppButton>
        </AppAnimatedView>
      </PagerSlideContent>
    </LinearGradient>
  );
}
