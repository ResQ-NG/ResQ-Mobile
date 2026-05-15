import { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AppAnimatedScrollView,
  AppAnimatedText,
  AppAnimatedView,
  FadeInDown,
  FadeInLeft,
} from '@/lib/animation';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import {
  MOCK_DESTINATION_INCIDENT_MEDIA,
  type MockDestinationEvent,
  type MockMediaItem,
} from '@/lib/mock/watchMeRouteSafetyMock';
import { SlideBackgroundDecor, SLIDE_BG_ICON_SIZE, SlideBgIonicon } from './SlideBackgroundDecor';
import { PagerSlideContent } from './pagerSlideInsets';
import { RouteAnalyticsMediaSlideshow } from './RouteAnalyticsMediaSlideshow';
import { MediaFullscreenModal } from './MediaFullscreenModal';

interface DestinationCheckSlideProps {
  destination: string;
  events: MockDestinationEvent[];
}

const EVENT_ICON: Record<
  MockDestinationEvent['type'],
  { name: string; color: string; bg: string }
> = {
  alert: { name: 'alert-circle', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  warning: {
    name: 'warning',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
  },
  info: { name: 'information-circle', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
};

export function DestinationCheckSlide({
  destination,
  events,
}: DestinationCheckSlideProps) {
  const [expandedMedia, setExpandedMedia] = useState<MockMediaItem | null>(null);

  return (
    <LinearGradient
      colors={['#431407', '#7c2d12', '#1c0a00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SlideBackgroundDecor
        name="warning"
        tint="accent"
        size={SLIDE_BG_ICON_SIZE.primary}
        style={{ top: 40, right: -24 }}
      />
      <SlideBackgroundDecor
        name="notifications"
        tint="muted"
        size={SLIDE_BG_ICON_SIZE.secondary}
        delay={140}
        style={{ bottom: 72, left: -20 }}
      />

      <PagerSlideContent style={{ paddingHorizontal: 20 }}>
        <AppAnimatedScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <RouteAnalyticsMediaSlideshow
            items={MOCK_DESTINATION_INCIDENT_MEDIA}
            onPressItem={setExpandedMedia}
          />

          <AppAnimatedText
            entering={FadeInDown.delay(60).springify()}
            className="text-orange-300 text-sm font-metropolis-semibold mb-1 mt-2"
          >
            Last 24 hours
          </AppAnimatedText>
          <AppAnimatedText
            entering={FadeInDown.delay(140).springify()}
            className="text-white text-2xl font-metropolis-bold mb-1"
          >
            Around {destination}
          </AppAnimatedText>
          <AppAnimatedText
            entering={FadeInDown.delay(220).springify()}
            className="text-white/50 text-sm font-metropolis-regular mb-6"
          >
            Swipe through recent incidents near your destination — tap any slide to view
            full screen.
          </AppAnimatedText>

          <View className="gap-4">
            {events.map((event, index) => {
              const icon = EVENT_ICON[event.type];
              return (
                <AppAnimatedView
                  key={event.id}
                  entering={FadeInLeft.delay(300 + index * 140).springify()}
                  className="flex-row gap-3"
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center shrink-0"
                    style={{ backgroundColor: icon.bg }}
                  >
                    <Ionicons name={icon.name as SlideBgIonicon} size={20} color={icon.color} />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-white font-metropolis-semibold text-sm mb-0.5">
                      {event.title}
                    </AppText>
                    <AppText className="text-white/60 text-xs font-metropolis-regular mb-1">
                      {event.detail}
                    </AppText>
                    <AppText className="text-white/40 text-xs font-metropolis-regular">
                      {event.timeAgo}
                    </AppText>
                  </View>
                </AppAnimatedView>
              );
            })}
          </View>
        </AppAnimatedScrollView>
      </PagerSlideContent>

      <MediaFullscreenModal
        visible={expandedMedia != null}
        item={expandedMedia}
        onClose={() => setExpandedMedia(null)}
      />
    </LinearGradient>
  );
}
