import { TouchableOpacity } from 'react-native';
import {
  AppAnimatedView,
  brandFadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from '@/lib/animation';
import SolarGalleryAddBoldIcon from '@/components/icons/solar/gallery-add-bold';
import SolarMapArrowRightBoldIcon from '@/components/icons/solar/map-arrow-right-bold';

interface CameraOverlayBottomBarProps {
  onCapture?: () => void;
  onAddMedia?: () => void;
  onNavigate?: () => void;
}

export function CameraOverlayBottomBar({
  onCapture,
  onAddMedia,
  onNavigate,
}: CameraOverlayBottomBarProps) {
  const scale = useSharedValue(1);

  const shutterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.88, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    onCapture?.();
  };

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(80)}
      className="flex-row items-center justify-between px-8"
    >
      {/* Add media */}
      <AppAnimatedView entering={brandFadeInUp.delay(120)}>
        <TouchableOpacity
          onPress={onAddMedia}
          className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(80,80,80,0.55)] items-center justify-center border-[1.5px] border-[rgba(255,255,255,0.2)]"
        >
          <SolarGalleryAddBoldIcon width={22} height={22} color="#fff" />
        </TouchableOpacity>
      </AppAnimatedView>

      {/* Shutter — spring scale is a runtime animated style, must stay as style prop */}
      <AppAnimatedView entering={brandFadeInUp} style={shutterStyle}>
        {/* Outer ring */}
        <AppAnimatedView className="w-[92px] h-[92px] rounded-full items-center justify-center border-[3px] border-[rgba(255,255,255,0.35)]">
          {/* Inner shutter button */}
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="w-[76px] h-[76px] rounded-full bg-white items-center justify-center border-4 border-[rgba(255,255,255,0.45)]"
          />
        </AppAnimatedView>
      </AppAnimatedView>

      {/* Navigate / compass */}
      <AppAnimatedView entering={brandFadeInUp.delay(120)}>
        <TouchableOpacity
          onPress={onNavigate}
          className="w-[52px] h-[52px] rounded-full bg-accent-red items-center justify-center"
        >
          <SolarMapArrowRightBoldIcon width={24} height={24} color="#fff" />
        </TouchableOpacity>
      </AppAnimatedView>
    </AppAnimatedView>
  );
}
