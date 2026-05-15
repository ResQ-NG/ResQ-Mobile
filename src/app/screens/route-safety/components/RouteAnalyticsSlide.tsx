import { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AppAnimatedScrollView,
  AppAnimatedText,
  AppAnimatedView,
} from '@/lib/animation';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { SlideBrandLabel } from './SlideBrandLabel';
import { SlideBackgroundDecor, SLIDE_BG_ICON_SIZE } from './SlideBackgroundDecor';
import { PagerSlideContent } from './pagerSlideInsets';
import { slideHeadline, slideBody, statRow } from './SlideAnimations';
import { RouteAnalyticsMediaSlideshow } from './RouteAnalyticsMediaSlideshow';
import { MediaFullscreenModal } from './MediaFullscreenModal';
import {
  getMockRouteInsights,
  MOCK_COMMUNITY_MEDIA,
  type MockMediaItem,
  type MockRoute,
  type MockRouteInsight,
} from '@/lib/mock/watchMeRouteSafetyMock';

interface RouteAnalyticsSlideProps {
  selectedRoute: MockRoute;
}

const TONE_STYLES = {
  positive: {
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.35)',
    icon: 'checkmark-circle' as const,
    color: '#22c55e',
  },
  neutral: {
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.12)',
    icon: 'information-circle' as const,
    color: 'rgba(255,255,255,0.7)',
  },
  caution: {
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.35)',
    icon: 'warning' as const,
    color: '#f59e0b',
  },
};

function InsightCard({ item, index }: { item: MockRouteInsight; index: number }) {
  const tone = TONE_STYLES[item.tone];

  return (
    <AppAnimatedView
      entering={statRow(index)}
      style={{
        marginBottom: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: tone.bg,
        borderWidth: 1,
        borderColor: tone.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        <Ionicons name={tone.icon} size={20} color={tone.color} style={{ marginTop: 1 }} />
        <View style={{ flex: 1 }}>
          <AppText
            style={{ color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 }}
          >
            {item.headline}
          </AppText>
          <AppText
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 14,
              lineHeight: 21,
              fontWeight: '400',
            }}
          >
            {item.body}
          </AppText>
        </View>
      </View>
    </AppAnimatedView>
  );
}

export function RouteAnalyticsSlide({ selectedRoute }: RouteAnalyticsSlideProps) {
  const insights = getMockRouteInsights(selectedRoute.id);
  const [expandedMedia, setExpandedMedia] = useState<MockMediaItem | null>(null);

  return (
    <LinearGradient
      colors={['#022c22', '#064e3b', '#0a1628']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={{ flex: 1 }}
    >
      <SlideBackgroundDecor
        name="chatbubbles"
        tint="success"
        size={SLIDE_BG_ICON_SIZE.primary}
        style={{ top: 24, right: -24 }}
      />
      <SlideBackgroundDecor
        name="document-text"
        tint="muted"
        size={SLIDE_BG_ICON_SIZE.secondary}
        delay={140}
        style={{ bottom: 64, left: -20 }}
      />

      <PagerSlideContent style={{ paddingHorizontal: 20 }}>
        <AppAnimatedScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <RouteAnalyticsMediaSlideshow
            items={MOCK_COMMUNITY_MEDIA}
            onPressItem={setExpandedMedia}
          />

          <View style={{ marginBottom: 8, marginTop: 10 }}>
            <SlideBrandLabel label="SITUATIONAL ANALYTICS" />
          </View>

          <View style={{ marginBottom: 14 }}>
            <AppAnimatedText
              entering={slideHeadline}
              style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 3 }}
            >
              {selectedRoute.label}
            </AppAnimatedText>
            <AppAnimatedText
              entering={slideBody}
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 8 }}
            >
              {selectedRoute.via}
            </AppAnimatedText>
            <AppAnimatedView entering={slideBody}>
              <AppText
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                Here is what recent Watch Me trips and community reports tell us about this
                route
              </AppText>
            </AppAnimatedView>
          </View>

          {insights.map((item, i) => (
            <InsightCard key={item.id} item={item} index={i} />
          ))}
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
