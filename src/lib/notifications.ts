import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ANDROID_DEFAULT_CHANNEL_ID = 'default';

/**
 * Call once at app load so foreground notifications show banner/sound as desired.
 */
export function setNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Create the default notification channel on Android (required for FCM and for
 * the permission prompt on Android 13+). Call before requesting permissions
 * or getting push tokens.
 */
export async function ensureDefaultChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_DEFAULT_CHANNEL_ID, {
    name: 'Default',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
  });
}

/**
 * Request notification permissions and return an Expo push token (for Expo
 * Push Service) or null if not a physical device / permission denied.
 * Uses FCM on Android when google-services.json is configured.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  if (Platform.OS === 'android') {
    await ensureDefaultChannel();
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
    if (projectId) {
      const { data } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      return data;
    }
  } catch {
    // No EAS projectId (e.g. local dev); can still use device push token
  }

  return null;
}

/**
 * Get the native FCM (Android) or APNs (iOS) push token. Use this when sending
 * via your own backend/FCM rather than Expo Push Service. Requires a dev build
 * and google-services.json / GoogleService-Info.plist to be configured.
 */
export async function getDevicePushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return null;
  try {
    const token = (await Notifications.getDevicePushTokenAsync()).data;
    return token;
  } catch {
    return null;
  }
}
