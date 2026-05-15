import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  View,
  type ListRenderItem,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import type { MockMediaItem } from '@/lib/mock/watchMeRouteSafetyMock';
import {
  ROUTE_ANALYTICS_SLIDESHOW,
  ROUTE_SAFETY_SCREEN_WIDTH,
} from '../routeSafetyScreenConstants';

const SLIDE_WIDTH =
  ROUTE_SAFETY_SCREEN_WIDTH - ROUTE_ANALYTICS_SLIDESHOW.horizontalPadding * 2;

type RouteAnalyticsMediaSlideshowProps = {
  items: MockMediaItem[];
  onPressItem: (item: MockMediaItem) => void;
};

export function RouteAnalyticsMediaSlideshow({
  items,
  onPressItem,
}: RouteAnalyticsMediaSlideshowProps) {
  const listRef = useRef<FlatList<MockMediaItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      if (items.length === 0) return;
      const safeIndex = index % items.length;
      listRef.current?.scrollToIndex({ index: safeIndex, animated });
      activeIndexRef.current = safeIndex;
      setActiveIndex(safeIndex);
    },
    [items.length]
  );

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, ROUTE_ANALYTICS_SLIDESHOW.intervalMs);
    return () => clearInterval(timer);
  }, [items.length, scrollToIndex]);

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
      activeIndexRef.current = index;
      setActiveIndex(index);
    },
    []
  );

  const renderItem: ListRenderItem<MockMediaItem> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => onPressItem(item)}
        accessibilityRole="button"
        accessibilityLabel={`View ${item.title}`}
        style={{ width: SLIDE_WIDTH, height: ROUTE_ANALYTICS_SLIDESHOW.height }}
      >
        <Image
          source={{ uri: item.thumbnailUri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            justifyContent: 'flex-end',
            paddingHorizontal: 14,
            paddingBottom: 12,
          }}
        >
          {item.kind === 'video' ? (
            <View
              style={{
                position: 'absolute',
                top: '35%',
                alignSelf: 'center',
                left: '42%',
              }}
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
              >
                <Ionicons name="play" size={20} color="#0f172a" style={{ marginLeft: 2 }} />
              </View>
            </View>
          ) : null}
          <AppText className="text-white font-metropolis-semibold text-sm" numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText className="text-white/60 text-xs font-metropolis-regular" numberOfLines={1}>
            {item.subtitle}
          </AppText>
        </LinearGradient>
      </TouchableOpacity>
    ),
    [onPressItem]
  );

  if (items.length === 0) return null;

  return (
    <View style={{ marginBottom: 14 }}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({
          length: SLIDE_WIDTH,
          offset: SLIDE_WIDTH * index,
          index,
        })}
        style={{
          width: SLIDE_WIDTH,
          height: ROUTE_ANALYTICS_SLIDESHOW.height,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
          marginTop: 10,
        }}
      >
        {items.map((item, i) => (
          <View
            key={item.id}
            style={{
              width: i === activeIndex ? 18 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                i === activeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </View>
    </View>
  );
}
