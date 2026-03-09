import { StyleSheet, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { CameraOverlay } from '@/components/evidence/CameraOverlay';
import { useMainCameraScreen } from '@/hooks/useMainCameraScreen';

export default function MainScreen() {
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
        location="MARYLAND, LAGOS."
        onLens={handleToggleCameraPosition}
        onCapture={handleCapture}
        onAddMedia={handleAddFromGallery}
        onAddFile={handleAddFile}
        onGalleryItemPress={handleGalleryItemPress}
      />
    </View>
  );
}
