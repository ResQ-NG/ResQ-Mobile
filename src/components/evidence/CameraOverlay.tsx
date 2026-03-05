import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { CameraOverlayHeader } from './CameraOverlayHeader';
import { CameraOverlaySidebar } from './CameraOverlaySidebar';
import { CameraOverlayGalleryStrip } from './CameraOverlayGalleryStrip';
import { CameraOverlayBottomBar } from './CameraOverlayBottomBar';

interface GalleryItem {
  uri: string;
  id: string;
}

interface CameraOverlayProps {
  location?: string;
  time?: string;
  avatarUri?: string;
  galleryItems?: GalleryItem[];
  onCapture?: () => void;
  onAddMedia?: () => void;
  onNavigate?: () => void;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  onFlash?: () => void;
  onVideoToggle?: () => void;
  onFlip?: () => void;
  onMic?: () => void;
  onText?: () => void;
  onLens?: () => void;
  onGalleryItemPress?: (item: GalleryItem) => void;
  onMorePress?: () => void;
}

export function CameraOverlay({
  location,
  time,
  avatarUri,
  galleryItems = [],
  onCapture,
  onAddMedia,
  onNavigate,
  onLocationPress,
  onNotificationPress,
  onFlash,
  onVideoToggle,
  onFlip,
  onMic,
  onText,
  onLens,
  onGalleryItemPress,
  onMorePress,
}: CameraOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Header: avatar, location, time, action icons */}
      <CameraOverlayHeader
        location={location}
        time={time}
        avatarUri={avatarUri}
        onLocationPress={onLocationPress}
        onNotificationPress={onNotificationPress}
      />

      {/* Right sidebar: flash, video, flip, mic, text, lens */}
      <CameraOverlaySidebar
        onFlash={onFlash}
        onVideoToggle={onVideoToggle}
        onFlip={onFlip}
        onMic={onMic}
        onText={onText}
        onLens={onLens}
      />

      {/* Bottom area: gallery strip + bottom bar — clears the floating tab bar */}
      <View
        style={{
          position: 'absolute',
          bottom: TAB_BAR_HEIGHT + insets.bottom + 20,
          left: 0,
          right: 0,
          gap: 16,
        }}
      >
        <CameraOverlayGalleryStrip
          items={galleryItems}
          onItemPress={onGalleryItemPress}
          onMorePress={onMorePress}
        />

        <CameraOverlayBottomBar
          onCapture={onCapture}
          onAddMedia={onAddMedia}
          onNavigate={onNavigate}
        />
      </View>
    </View>
  );
}
