// config.ts
import Constants from "expo-constants";

// In EAS builds, environment variables are available via process.env
// Fallback to Constants.expoConfig.extra for local development
export const AppConfig = {
  BASE_URL:
    process.env.EXPO_PUBLIC_BASE_URL || Constants.expoConfig?.extra?.BASE_URL,
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
};

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
