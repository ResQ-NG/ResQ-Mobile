import Constants from 'expo-constants';

/** Maps Platform key with Places API enabled (restrict by bundle id / SHA-1 in production). */
export const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  (Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY as string | undefined);
