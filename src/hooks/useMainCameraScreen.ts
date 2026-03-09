import { useRef, useState } from 'react';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useCameraMicPermissionsBanner } from '@/hooks/useCameraMicPermissionsBanner';
import { addMedia, getCapturedMedia } from '@/lib/utils/captured-media';

export function useMainCameraScreen() {
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const device = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera>(null);
  const { hasCameraAndMic } = useCameraMicPermissionsBanner();

  const handleToggleCameraPosition = () => {
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePhoto();

      if (photo?.path) {
        addMedia(photo.path);
      }
    } catch (error) {
      console.warn('Failed to take photo', error);
    }
  };

  const handleAddFromGallery = async () => {
    try {
      const { status, granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted && status !== 'granted') {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos', 'livePhotos'],
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 30,
      });

      if (result.canceled) return;

      for (const asset of result.assets) {
        if (asset.uri) addMedia(asset.uri);
      }
    } catch (error) {
      console.warn('Failed to pick images from gallery', error);
    }
  };

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if ('canceled' in result && result.canceled) {
        return;
      }

      // At this stage we only open the picker; selected files can be wired into
      // a dedicated attachments store or details screen later.
      // TODO: this would later handle things like pdf previews
    } catch (error) {
      console.warn('Failed to pick files', error);
    }
  };

  const handleGalleryItemPress = (item: { id: string; uri: string }) => {
    const items = getCapturedMedia();
    const index = items.findIndex((m) => m.id === item.id);

    router.push({
      pathname: '/(modals)/image-preview',
      params: {
        uri: item.uri,
        mode: 'details',
        index: index >= 0 ? String(index) : 'NaN',
        allowDelete: 'true',
      },
    } as Parameters<typeof router.push>[0]);
  };

  return {
    cameraRef,
    device,
    hasCameraAndMic,
    handleToggleCameraPosition,
    handleCapture,
    handleAddFromGallery,
    handleAddFile,
    handleGalleryItemPress,
  };
}

