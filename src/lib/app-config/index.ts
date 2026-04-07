// config.ts
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

function normalizeApiBaseUrl(raw: string | undefined): string | undefined {
  if (raw == null || typeof raw !== "string") return undefined;
  const t = raw.trim().replace(/\/+$/, "");
  return t.length > 0 ? t : undefined;
}

/**
 * Expo only inlines env vars prefixed with EXPO_PUBLIC_ into the JS bundle.
 * A plain `BASE_URL` in .env is ignored unless you also set EXPO_PUBLIC_BASE_URL.
 */
const rawBaseUrl =
  process.env.EXPO_PUBLIC_BASE_URL ||
  (typeof process.env.BASE_URL === "string" ? process.env.BASE_URL : undefined) ||
  (Constants.expoConfig?.extra?.BASE_URL as string | undefined);

// In EAS builds, environment variables are available via process.env
// Fallback to Constants.expoConfig.extra for local development
export const AppConfig = {
  BASE_URL: normalizeApiBaseUrl(rawBaseUrl),
  GOOGLE_CLIENT_ID:
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID,
  ANDROID_CLIENT_ID:
    process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID ||
    Constants.expoConfig?.extra?.ANDROID_CLIENT_ID,
  IOS_CLIENT_ID:
    process.env.EXPO_PUBLIC_IOS_CLIENT_ID ||
    Constants.expoConfig?.extra?.IOS_CLIENT_ID,
  CLIENT_SOURCE: "rider-app",
  APP_VERSION: Constants.expoConfig?.version,
  MAPBOX_ACCESS_TOKEN:
    process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    Constants.expoConfig?.extra?.MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE_URL:
    process.env.EXPO_PUBLIC_MAPBOX_STYLE_URL ||
    Constants.expoConfig?.extra?.MAPBOX_STYLE_URL,
  MAPBOX_STYLE_URL_DARK:
    process.env.EXPO_PUBLIC_MAPBOX_STYLE_URL_DARK ||
    Constants.expoConfig?.extra?.MAPBOX_STYLE_URL_DARK,
};

if (__DEV__) {
  const url = AppConfig.BASE_URL;
  if (!url) {
    console.warn(
      "[AppConfig] Missing API base URL. Set EXPO_PUBLIC_BASE_URL in .env and restart Expo (e.g. http://192.168.1.10:8000 for a device on the same Wi‑Fi)."
    );
  } else if (
    /localhost|127\.0\.0\.1/i.test(url) &&
    Device.isDevice &&
    Platform.OS !== "web"
  ) {
    console.warn(
      "[AppConfig] EXPO_PUBLIC_BASE_URL uses localhost, but this build is on a physical device. Use your computer’s LAN IP (e.g. http://192.168.x.x:8000) so the phone can reach the server."
    );
  }
}

// Debug helper - call this to see what values are loaded
export const debugAppConfig = () => {
  console.log("=== AppConfig Debug ===");
  console.log("BASE_URL:", AppConfig.BASE_URL);
  console.log(
    "process.env.EXPO_PUBLIC_BASE_URL:",
    process.env.EXPO_PUBLIC_BASE_URL
  );
  console.log(
    "Constants.expoConfig?.extra?.BASE_URL:",
    Constants.expoConfig?.extra?.BASE_URL
  );
  console.log(
    "Full extra:",
    JSON.stringify(Constants.expoConfig?.extra, null, 2)
  );
  console.log("=======================");
  return AppConfig;
};
