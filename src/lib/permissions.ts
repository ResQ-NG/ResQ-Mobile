import { Camera } from 'react-native-vision-camera';
import * as ImagePicker from 'expo-image-picker';

export const CAMERA_MIC_BANNER_ID = 'camera-mic-permissions';
export const MEDIA_LIBRARY_BANNER_ID = 'media-library-permissions';

export async function areCameraAndMicAuthorized(): Promise<boolean> {
  const cameraStatus = (await Camera.getCameraPermissionStatus()) as string;
  const micStatus = (await Camera.getMicrophonePermissionStatus()) as string;

  // VisionCamera v4 uses 'granted' | 'not-determined' | 'denied' | 'restricted'
  return cameraStatus === 'granted' && micStatus === 'granted';
}

export async function requestCameraAndMicPermissions(): Promise<boolean> {
  const nextCamera = (await Camera.requestCameraPermission()) as string;
  const nextMic = (await Camera.requestMicrophonePermission()) as string;

  // Permission request result is 'granted' | 'denied'
  return nextCamera === 'granted' && nextMic === 'granted';
}

export async function isMediaLibraryAuthorized(): Promise<boolean> {
  const { status, granted } =
    await ImagePicker.getMediaLibraryPermissionsAsync();
  return granted || status === 'granted';
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status, granted } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  return granted || status === 'granted';
}

