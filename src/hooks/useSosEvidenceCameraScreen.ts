import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { useCameraDevice } from 'react-native-vision-camera';
import type { Camera } from 'react-native-vision-camera';
import { useCameraMicPermissionsBanner } from '@/hooks/useCameraMicPermissionsBanner';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useSosEvidenceStore } from '@/stores/sos-evidence-store';

export function useSosEvidenceCameraScreen() {
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const device = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera>(null);
  const { hasCameraAndMic } = useCameraMicPermissionsBanner();
  const addMedia = useSosEvidenceStore((s) => s.addMedia);

  const handleToggleCameraPosition = () => {
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePhoto();
      if (photo?.path) {
        const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
        addMedia(uri, 'image');
      }
    } catch (error) {
      console.warn('Failed to take photo', error);
    }
  };

  const handleBack = usePreventDoublePress(() => router.back());

  return {
    cameraRef,
    device,
    hasCameraAndMic,
    handleToggleCameraPosition,
    handleCapture,
    handleBack,
  };
}
