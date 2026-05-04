import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Camera } from 'react-native-vision-camera';
import { CameraOverlay } from '@/components/evidence/CameraOverlay';
import { useCurrentUserProfileAvatar } from '@/hooks/useCurrentUserProfileAvatar';
import { useMainCameraScreen } from '@/hooks/useMainCameraScreen';
import { useUserLocationStore } from '@/stores/user-location-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useSosConfirmSheetStore } from '@/stores/sos-confirm-sheet-store';
import { useAppModalStore } from '@/stores/app-modal-store';

const SOS_LOADING_DURATION_MS = 1200;

export default function MainScreen() {
  const { avatarUri, displayName } = useCurrentUserProfileAvatar();
  const locationLabel = useUserLocationStore((s) => s.addressLabel);
  const openSosConfirmSheet = useSosConfirmSheetStore((s) => s.open);
  const { showLoading, setProgress, hide: hideAppModal } = useAppModalStore();
  const handleSosPress = usePreventDoublePress(openSosConfirmSheet);
  const openHowToUseGuide = usePreventDoublePress(() =>
    router.push('/(modals)/how-to-use-app')
  );
  const handleSosLongPress = usePreventDoublePress(() => {
    showLoading({ message: 'Starting Watch Me session...', progress: 0 });
    setTimeout(() => setProgress(40), 400);
    setTimeout(() => setProgress(80), 800);
    setTimeout(() => {
      setProgress(100);
      router.push('/screens/sos');
      hideAppModal();
    }, SOS_LOADING_DURATION_MS);
  });
  const {
    cameraRef,
    device,
    hasCameraAndMic,
    handleToggleCameraPosition,
    handleCapture,
    handleAddFromGallery,
    handleAddFile,
    handleGalleryItemPress,
  } = useMainCameraScreen();

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {device && hasCameraAndMic && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          photo
        />
      )}

      <CameraOverlay
        location={locationLabel}
        avatarUri={avatarUri}
        avatarAltText={displayName}
        onLens={handleToggleCameraPosition}
        onCapture={handleCapture}
        onAddMedia={handleAddFromGallery}
        onAddFile={handleAddFile}
        onGalleryItemPress={handleGalleryItemPress}
        onSosPress={handleSosPress}
        onSosLongPress={handleSosLongPress}
        onInfoPress={openHowToUseGuide}
      />
    </View>
  );
}
