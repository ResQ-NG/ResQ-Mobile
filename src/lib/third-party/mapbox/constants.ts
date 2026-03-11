export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
export const MAPBOX_STYLE_URL = process.env.EXPO_PUBLIC_MAPBOX_STYLE_URL;
export const MAPBOX_STYLE_URL_DARK = process.env.EXPO_PUBLIC_MAPBOX_STYLE_URL_DARK;

// Default coordinates for USA (geographic center near Kansas)
// Format: [longitude, latitude]
export const DEFAULT_USA_COORDINATES: [number, number] = [-95.7129, 37.0902];

export const GlobalMapboxConfig = (isDark: boolean) => {
  return {
  accessToken: MAPBOX_ACCESS_TOKEN,
  compassEnabled: false,
  logoEnabled: false,
  styleURL: isDark ? MAPBOX_STYLE_URL_DARK : MAPBOX_STYLE_URL,
  attributionEnabled: false,
  zoomEnabled: true,
  rotateEnabled: true,
  pitchEnabled: true,
  userLocationEnabled: false,
  userLocationPitchAlignment: "auto",
  scaleBarEnabled: false,
  animationType: "flyTo",
  animationDuration: 500,
} as const };
