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
  /** When set, header shows back button instead of avatar/SOS (e.g. SOS evidence). */
  onBack?: () => void;
  onCapture?: () => void;
  onAddMedia?: () => void;
  onAddFile?: () => void;
  onLocationPress?: () => void;
  onSosPress?: () => void;
  onSosLongPress?: () => void;
  /** Right control on bottom bar when there’s no media yet (info icon). */
  onInfoPress?: () => void;
  onFlash?: () => void;
  onVideoToggle?: () => void;
  onFlip?: () => void;
  onMic?: () => void;
  onText?: () => void;
  onLens?: () => void;
  onGalleryItemPress?: (item: { id: string; uri: string }) => void;
  onMorePress?: () => void;
  /** When false, hide gallery strip (e.g. SOS evidence screen). Default true. */
  showGalleryStrip?: boolean;
  /** When set, use this for bottom offset instead of TAB_BAR_HEIGHT + insets (e.g. screens without tab bar). */
  bottomOffset?: number;
  /** When true, bottom bar shows only shutter (no add media, no right button). Default false. */
  shutterOnly?: boolean;
}

export function CameraOverlay({
  location,
  avatarUri,
  onBack,
  onCapture,
  onAddMedia,
  onAddFile,
  onSosPress,
  onSosLongPress,
  onInfoPress,
  onFlash,
  onVideoToggle,
  onFlip,
  onMic,
  onText,
  onLens,
  onGalleryItemPress,
  onMorePress,
  showGalleryStrip = true,
  bottomOffset,
  shutterOnly = false,
}: CameraOverlayProps) {
  const insets = useSafeAreaInsets();
  const bottom =
    bottomOffset ?? TAB_BAR_HEIGHT + insets.bottom + 20;

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <CameraOverlayHeader
        location={location}
        avatarUri={avatarUri}
        onBack={onBack}
        onSosPress={onSosPress}
        onSosLongPress={onSosLongPress}
      />

      <CameraOverlaySidebar
        onFlash={onFlash}
        onVideoToggle={onVideoToggle}
        onFlip={onFlip}
        onMic={onMic}
        onText={onText}
        onLens={onLens}
        onAddFile={onAddFile}
      />

      <View
        style={{
          position: 'absolute',
          bottom,
          left: 0,
          right: 0,
          gap: showGalleryStrip ? 16 : 0,
        }}
      >
        {showGalleryStrip && (
          <CameraOverlayGalleryStrip
            onItemPress={onGalleryItemPress}
            onMorePress={onMorePress}
          />
        )}

        <CameraOverlayBottomBar
          onCapture={onCapture}
          onAddMedia={onAddMedia}
          onInfoPress={onInfoPress}
          shutterOnly={shutterOnly}
        />
      </View>
    </View>
  );
}
