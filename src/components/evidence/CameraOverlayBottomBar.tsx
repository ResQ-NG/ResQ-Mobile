import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import {
  AppAnimatedView,
  brandFadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from '@/lib/animation';
import SolarGalleryAddBoldIcon from '@/components/icons/solar/gallery-add-bold';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import SolarMapArrowRightBoldIcon from '@/components/icons/solar/map-arrow-right-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import { useCapturedMediaStore } from '@/stores/captured-media-store';

interface CameraOverlayBottomBarProps {
  onCapture?: () => void;
  onAddMedia?: () => void;
  onInfoPress?: () => void;
}

export function CameraOverlayBottomBar({
  onCapture,
  onAddMedia,
  onInfoPress,
}: CameraOverlayBottomBarProps) {
  const { theme } = useAppColorScheme();
  const scale = useSharedValue(1);
  const hasMedia = useCapturedMediaStore((s) => s.items.length) > 0;

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

  const handleRightPress = () => {
    if (hasMedia) {
      router.push('/screens/report-management');
    } else {
      onInfoPress?.();
    }
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
          <SolarGalleryAddBoldIcon
            width={22}
            height={22}
            color={theme.iconOnAccent}
          />
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

      {/* Right: info when no media, send when there is media */}
      <AppAnimatedView entering={brandFadeInUp.delay(120)}>
        <TouchableOpacity
          onPress={handleRightPress}
          className="w-[52px] h-[52px] rounded-full items-center justify-center border-[1.5px] border-[rgba(255,255,255,0.2)]"
          style={{
            backgroundColor: hasMedia ? '#fff' : 'rgba(80,80,80,0.55)',
          }}
        >
          {hasMedia ? (
            <SolarMapArrowRightBoldIcon
              width={24}
              height={24}
              color="#F00033"
              style={{ transform: [{ rotate: '-40deg' }] }}
            />
          ) : (
            <SolarInfoCircleBoldIcon
              width={24}
              height={24}
              color={theme.iconOnAccent}
            />
          )}
        </TouchableOpacity>
      </AppAnimatedView>
    </AppAnimatedView>
  );
}
