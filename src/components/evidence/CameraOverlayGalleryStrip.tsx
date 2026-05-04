import { TouchableOpacity, View } from 'react-native';
import {
  AppAnimatedView,
  AppAnimatedImage,
  AppAnimatedScrollView,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { useCapturedMediaStore } from '@/stores/captured-media-store';

interface GalleryItem {
  uri: string;
  id: string;
}

interface CameraOverlayGalleryStripProps {
  onItemPress?: (item: GalleryItem) => void;
  onMorePress?: () => void;
}

const PLACEHOLDER_MEDIA_SLOTS = 5;

export function CameraOverlayGalleryStrip({
  onItemPress,
  onMorePress,
}: CameraOverlayGalleryStripProps) {
  const items = useCapturedMediaStore((state) => state.items);
  const showPlaceholders = items.length === 0;

  return (
    <AppAnimatedView
      entering={brandFadeInUp}
      className="flex-row items-center px-3"
    >
      <AppAnimatedScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 4, paddingRight: 4 }}
        className="flex-1"
      >
        {showPlaceholders
          ? Array.from({ length: PLACEHOLDER_MEDIA_SLOTS }).map((_, index) => (
              <AppAnimatedView
                key={`media-placeholder-${index}`}
                entering={brandFadeInUp.delay(index * 40)}
              >
                <View
                  className="w-16 h-16 rounded-[10px] border-[1.5px] border-dashed border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.06)]"
                  style={{ borderStyle: 'dashed' }}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              </AppAnimatedView>
            ))
          : items.map((item, index) => (
              <AppAnimatedView
                key={item.id}
                entering={brandFadeInUp.delay(index * 40)}
              >
                <TouchableOpacity
                  onPress={() => onItemPress?.(item)}
                  className="w-16 h-16 rounded-[10px] overflow-hidden border-[1.5px] border-[rgba(255,255,255,0.25)]"
                >
                  <AppAnimatedImage
                    source={{ uri: item.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </AppAnimatedView>
            ))}
      </AppAnimatedScrollView>

      {/* More arrow */}
      {items.length > 7 && (
        <TouchableOpacity onPress={onMorePress} className="pl-1">
          <AppText className="text-white text-3xl font-metropolis-bold">
            ›
          </AppText>
        </TouchableOpacity>
      )}
    </AppAnimatedView>
  );
}
