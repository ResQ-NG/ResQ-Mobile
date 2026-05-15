import { useMemo, useState } from 'react';
import { Share, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AppAnimatedScrollView,
  AppAnimatedText,
  AppAnimatedView,
} from '@/lib/animation';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import SolarShareBoldIcon from '@/components/icons/solar/share-bold';
import { SlideBrandLabel } from './SlideBrandLabel';
import { SlideBackgroundDecor, SLIDE_BG_ICON_SIZE } from './SlideBackgroundDecor';
import { PagerSlideContent } from './pagerSlideInsets';
import { slideLabel, slideHeadline, slideBody, slideCard } from './SlideAnimations';
import { RouteJourneyMap } from './RouteJourneyMap';
import { RouteMapFullscreenModal } from './RouteMapFullscreenModal';
import {
  MOCK_JOURNEY_DESTINATION,
  MOCK_JOURNEY_ORIGIN,
  type MockRoute,
} from '@/lib/mock/watchMeRouteSafetyMock';

const COLLAPSED_MAP_HEIGHT = 168;

interface RouteCardsSlideProps {
  routes: MockRoute[];
  selectedRouteId: string;
  origin: string;
  destination: string;
  onSelectRoute: (id: string) => void;
}

function safetyLevelLabel(level: MockRoute['safetyLevel']) {
  return level === 'safe' ? 'Safe' : level === 'moderate' ? 'Moderate' : 'Caution';
}

function RouteListRow({
  route,
  index,
  selected,
  onPress,
}: {
  route: MockRoute;
  index: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <AppAnimatedView entering={slideCard(index)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`${route.label}, ${route.via}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 14,
          marginBottom: 8,
          borderWidth: selected ? 1.5 : 1,
          borderColor: selected ? route.accentColor + '99' : 'rgba(255,255,255,0.08)',
          backgroundColor: selected ? route.accentColor + '18' : 'rgba(255,255,255,0.04)',
        }}
      >
        <View
          style={{
            width: 4,
            height: 40,
            borderRadius: 2,
            backgroundColor: route.accentColor,
            opacity: selected ? 1 : 0.45,
          }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <AppText className="text-white font-metropolis-semibold text-sm">{route.label}</AppText>
            {route.isRecommended ? (
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: route.accentColor + '28' }}
              >
                <AppText style={{ color: route.accentColor, fontSize: 9, fontWeight: '700' }}>
                  BEST
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText className="text-white/55 text-xs font-metropolis-regular" numberOfLines={1}>
            {route.via}
          </AppText>
          <AppText className="text-white/40 text-[11px] font-metropolis-regular mt-1">
            {route.distanceKm} km · {route.durationMin} min · {safetyLevelLabel(route.safetyLevel)}
          </AppText>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <AppText style={{ color: route.accentColor, fontSize: 18, fontWeight: '800' }}>
            {route.safetyScore}
          </AppText>
          <AppText className="text-white/35 text-[10px] font-metropolis-regular">safety</AppText>
        </View>
        {selected ? (
          <Ionicons name="checkmark-circle" size={20} color={route.accentColor} />
        ) : (
          <Ionicons name="ellipse-outline" size={20} color="rgba(255,255,255,0.2)" />
        )}
      </TouchableOpacity>
    </AppAnimatedView>
  );
}

export function RouteCardsSlide({
  routes,
  selectedRouteId,
  origin,
  destination,
  onSelectRoute,
}: RouteCardsSlideProps) {
  const [mapFullscreen, setMapFullscreen] = useState(false);

  const selectedRoute = useMemo(
    () => routes.find((r) => r.id === selectedRouteId) ?? routes[0],
    [routes, selectedRouteId]
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `ResQ Route Analysis\n${origin || 'My location'} → ${destination}\n\n${selectedRoute.label} (${selectedRoute.via})\nSafety score: ${selectedRoute.safetyScore}/100 · ${selectedRoute.distanceKm} km · ${selectedRoute.durationMin} min\n\n${selectedRoute.summary}`,
        title: 'ResQ Route Analysis',
      });
    } catch {
      // cancelled
    }
  };

  return (
    <LinearGradient
      colors={['#08111f', '#0d1c33', '#0a1628']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SlideBackgroundDecor
        name="layers"
        tint="primary"
        size={SLIDE_BG_ICON_SIZE.primary}
        style={{ top: 32, right: -24 }}
      />
      <SlideBackgroundDecor
        name="git-branch"
        tint="muted"
        size={SLIDE_BG_ICON_SIZE.secondary}
        delay={140}
        style={{ bottom: 96, left: -20 }}
      />

      <PagerSlideContent>
        <View className="flex-row items-center justify-between px-5" style={{ marginBottom: 8 }}>
          <SlideBrandLabel label="ROUTE ANALYSIS" />
          <AppAnimatedView entering={slideLabel}>
            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.7}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              accessibilityLabel="Share route analysis"
            >
              <SolarShareBoldIcon width={16} height={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </AppAnimatedView>
        </View>

        <View className="px-5 mb-2">
          <AppAnimatedText
            entering={slideHeadline}
            style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 2 }}
          >
            Choose your route
          </AppAnimatedText>
          <AppAnimatedText
            entering={slideBody}
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}
            numberOfLines={1}
          >
            {origin ? `${origin} → ` : ''}
            {destination}
          </AppAnimatedText>
        </View>

        {/* Collapsed map — updates with selected route */}
        <View className="px-4 mb-3">
          <View style={{ position: 'relative' }}>
            <RouteJourneyMap
              route={selectedRoute}
              origin={MOCK_JOURNEY_ORIGIN}
              destination={MOCK_JOURNEY_DESTINATION}
              height={COLLAPSED_MAP_HEIGHT}
            />
            <TouchableOpacity
              onPress={() => setMapFullscreen(true)}
              activeOpacity={0.85}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.55)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
              }}
              accessibilityLabel="Expand map full screen"
              accessibilityRole="button"
            >
              <Ionicons name="expand" size={16} color="#fff" />
              <AppText className="text-white text-xs font-metropolis-semibold">Full map</AppText>
            </TouchableOpacity>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                right: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                className="rounded-lg px-2.5 py-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              >
                <AppText className="text-white/90 text-[10px] font-metropolis-semibold">
                  {selectedRoute.label}
                </AppText>
              </View>
              <View
                className="rounded-lg px-2.5 py-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              >
                <AppText className="text-white/70 text-[10px] font-metropolis-regular">
                  {selectedRoute.durationMin} min · {selectedRoute.distanceKm} km
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <AppAnimatedScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <AppText className="text-white/40 text-[11px] font-metropolis-semibold uppercase tracking-wide mb-2 px-1">
            {routes.length} routes
          </AppText>
          {routes.map((route, index) => (
            <RouteListRow
              key={route.id}
              route={route}
              index={index}
              selected={route.id === selectedRouteId}
              onPress={() => onSelectRoute(route.id)}
            />
          ))}
        </AppAnimatedScrollView>

        <AppAnimatedView
          entering={slideBody}
          className="flex-row items-center justify-center gap-1.5 py-2"
          pointerEvents="none"
        >
          <AppText style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            Swipe for analytics
          </AppText>
          <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.3)" />
        </AppAnimatedView>
      </PagerSlideContent>

      <RouteMapFullscreenModal
        visible={mapFullscreen}
        route={selectedRoute}
        originLabel={origin}
        destinationLabel={destination}
        onClose={() => setMapFullscreen(false)}
      />
    </LinearGradient>
  );
}
