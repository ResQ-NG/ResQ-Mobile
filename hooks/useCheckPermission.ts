import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export const useCheckPermission = () => {
  const [cameraPermission, setCameraPermission] = useState<null | boolean>(null);
  const [microphonePermission, setMicrophonePermission] = useState<null | boolean>(null);
  const [galleryPermission, setGalleryPermission] = useState<null | boolean>(null);

  const checkPermissions = async () => {
    const cameraResponse = await Camera.getCameraPermissionsAsync();
    setCameraPermission(cameraResponse?.granted ?? false);

    const microphoneResponse = await Camera.getMicrophonePermissionsAsync();
    setMicrophonePermission(microphoneResponse?.granted ?? false);

    // Skip gallery permission check on Android when using Expo Go
    if (Platform.OS === 'ios' || !__DEV__) {
      const galleryResponse = await MediaLibrary.getPermissionsAsync();
      setGalleryPermission(galleryResponse?.granted ?? false);
    } else {
      setGalleryPermission(true);
    }
  };

  const requestPermissions = async () => {
    const cameraResponse = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraResponse?.granted ?? false);

    const microphoneResponse = await Camera.requestMicrophonePermissionsAsync();
    setMicrophonePermission(microphoneResponse?.granted ?? false);

    // Skip gallery permission request on Android when using Expo Go
    if (Platform.OS === 'ios' || !__DEV__) {
      const galleryResponse = await MediaLibrary.requestPermissionsAsync();
      setGalleryPermission(galleryResponse?.granted ?? false);
    } else {
      setGalleryPermission(true);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const allPermissionsGranted = cameraPermission && microphonePermission && galleryPermission;

  return {
    cameraPermission,
    microphonePermission,
    galleryPermission,
    allPermissionsGranted,
    requestPermissions,
    checkPermissions
  };
};
