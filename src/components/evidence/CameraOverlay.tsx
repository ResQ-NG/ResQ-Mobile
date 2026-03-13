import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { CameraOverlayHeader } from './CameraOverlayHeader';
import { CameraOverlaySidebar } from './CameraOverlaySidebar';
import { CameraOverlayGalleryStrip } from './CameraOverlayGalleryStrip';
import { CameraOverlayBottomBar } from './CameraOverlayBottomBar';

interface CameraOverlayProps {
  location?: string;
  avatarUri?: string;
  onCapture?: () => void;
  onAddMedia?: () => void;
  onAddFile?: () => void;
  onLocationPress?: () => void;
  onSosPress?: () => void;
  onFlash?: () => void;
  onVideoToggle?: () => void;
  onFlip?: () => void;
  onMic?: () => void;
  onText?: () => void;
  onLens?: () => void;
  onGalleryItemPress?: (item: { id: string; uri: string }) => void;
  onMorePress?: () => void;
}

export function CameraOverlay({
  location,
  avatarUri,
  onCapture,
  onAddMedia,
  onAddFile,
  onSosPress,
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
        avatarUri={avatarUri}
        onSosPress={onSosPress}
      />

      {/* Right sidebar: flash, video, flip, mic, text, lens */}
      <CameraOverlaySidebar
        onFlash={onFlash}
        onVideoToggle={onVideoToggle}
        onFlip={onFlip}
        onMic={onMic}
        onText={onText}
        onLens={onLens}
        onAddFile={onAddFile}
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
          onItemPress={onGalleryItemPress}
          onMorePress={onMorePress}
        />

        <CameraOverlayBottomBar onCapture={onCapture} onAddMedia={onAddMedia} />
      </View>
    </View>
  );
}
