import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AppAnimatedScrollView,
  AppAnimatedText,
  AppAnimatedView,
  FadeInDown,
} from '@/lib/animation';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import type { MockMediaItem } from '@/lib/mock/watchMeRouteSafetyMock';
import { SlideBackgroundDecor, SLIDE_BG_ICON_SIZE } from './SlideBackgroundDecor';
import { SlideBrandLabel } from './SlideBrandLabel';
import { PagerSlideContent } from './pagerSlideInsets';
import { slideBody, slideCard } from './SlideAnimations';
import { MediaFullscreenModal } from './MediaFullscreenModal';

interface RouteMediaSlideProps {
  items: MockMediaItem[];
}

function kindMeta(kind: MockMediaItem['kind']) {
  switch (kind) {
    case 'video':
      return { label: 'Video', icon: 'play-circle' as const, color: '#60a5fa' };
    case 'report':
      return { label: 'Report', icon: 'document-text' as const, color: '#f59e0b' };
    case 'photo':
      return { label: 'Photo', icon: 'image' as const, color: '#a78bfa' };
  }
}

function MediaListCard({
  item,
  index,
  onExpand,
}: {
  item: MockMediaItem;
  index: number;
  onExpand: () => void;
}) {
  const meta = kindMeta(item.kind);

  return (
    <AppAnimatedView entering={slideCard(index)}>
      <TouchableOpacity
        onPress={onExpand}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={`Expand ${item.title}`}
        style={{
          flexDirection: 'row',
          gap: 12,
          padding: 10,
          borderRadius: 16,
          marginBottom: 10,
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <View style={{ width: 96, height: 72, borderRadius: 12, overflow: 'hidden' }}>
          <Image
            source={{ uri: item.thumbnailUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {item.kind === 'video' ? (
            <View
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
            >
              <Ionicons name="play" size={22} color="#fff" />
            </View>
          ) : null}
          {item.durationLabel ? (
            <View
              className="absolute bottom-1 right-1 rounded px-1.5 py-0.5"
              style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
            >
              <AppText className="text-white text-[10px] font-metropolis-medium">
                {item.durationLabel}
              </AppText>
            </View>
          ) : null}
        </View>

        <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons name={meta.icon} size={12} color={meta.color} />
            <AppText style={{ color: meta.color, fontSize: 10, fontWeight: '700' }}>
              {meta.label.toUpperCase()}
            </AppText>
          </View>
          <AppText className="text-white font-metropolis-semibold text-sm mb-0.5" numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText className="text-white/50 text-xs font-metropolis-regular" numberOfLines={2}>
            {item.subtitle}
          </AppText>
          {item.authorLabel ? (
            <AppText className="text-white/35 text-[10px] font-metropolis-regular mt-1">
              {item.authorLabel}
            </AppText>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={onExpand}
          hitSlop={8}
          className="self-center w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          accessibilityLabel="View full screen"
        >
          <Ionicons name="expand" size={16} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </AppAnimatedView>
  );
}

export function RouteMediaSlide({ items }: RouteMediaSlideProps) {
  const [expandedItem, setExpandedItem] = useState<MockMediaItem | null>(null);

  const videos = items.filter((i) => i.kind === 'video');
  const reports = items.filter((i) => i.kind === 'report' || i.kind === 'photo');

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={{ flex: 1 }}
    >
      <SlideBackgroundDecor
        name="play-circle"
        tint="muted"
        size={SLIDE_BG_ICON_SIZE.primary}
        style={{ top: 40, right: -24 }}
      />
      <SlideBackgroundDecor
        name="videocam"
        tint="primary"
        size={SLIDE_BG_ICON_SIZE.secondary}
        delay={140}
        style={{ bottom: 72, left: -20 }}
      />

      <PagerSlideContent className="flex-1 px-5">
        <View style={{ marginBottom: 8 }}>
          <SlideBrandLabel label="COMMUNITY INSIGHTS" />
        </View>

        <AppAnimatedText
          entering={FadeInDown.delay(80).springify()}
          className="text-white text-xl font-metropolis-bold mb-1"
        >
          See what we mean
        </AppAnimatedText>
        <AppAnimatedText
          entering={slideBody}
          className="text-white/55 text-sm font-metropolis-regular mb-4"
        >
          Videos, photos, and reports from people who have taken these routes recently.
        </AppAnimatedText>

        <AppAnimatedScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {videos.length > 0 ? (
            <View className="mb-4">
              <AppText className="text-white/40 text-[11px] font-metropolis-semibold uppercase tracking-wide mb-2">
                Videos
              </AppText>
              {videos.map((item, index) => (
                <MediaListCard
                  key={item.id}
                  item={item}
                  index={index}
                  onExpand={() => setExpandedItem(item)}
                />
              ))}
            </View>
          ) : null}

          {reports.length > 0 ? (
            <View>
              <AppText className="text-white/40 text-[11px] font-metropolis-semibold uppercase tracking-wide mb-2">
                Reports & photos
              </AppText>
              {reports.map((item, index) => (
                <MediaListCard
                  key={item.id}
                  item={item}
                  index={videos.length + index}
                  onExpand={() => setExpandedItem(item)}
                />
              ))}
            </View>
          ) : null}
        </AppAnimatedScrollView>
      </PagerSlideContent>

      <MediaFullscreenModal
        visible={expandedItem != null}
        item={expandedItem}
        onClose={() => setExpandedItem(null)}
      />
    </LinearGradient>
  );
}
