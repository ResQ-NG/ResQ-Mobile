import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera } from 'react-native-vision-camera';
import { CameraOverlay } from '@/components/evidence/CameraOverlay';
import { useSosEvidenceCameraScreen } from '@/hooks/useSosEvidenceCameraScreen';

export default function SosEvidenceScreen() {
  const insets = useSafeAreaInsets();
  const {
    cameraRef,
    device,
    hasCameraAndMic,
    handleToggleCameraPosition,
    handleCapture,
    handleBack,
  } = useSosEvidenceCameraScreen();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
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
        onBack={handleBack}
        onCapture={handleCapture}
        onLens={handleToggleCameraPosition}
        showGalleryStrip={false}
        bottomOffset={insets.bottom + 32}
        shutterOnly
      />
    </View>
  );
}
