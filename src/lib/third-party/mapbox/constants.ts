export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
export const MAPBOX_STYLE_URL = process.env.EXPO_PUBLIC_MAPBOX_STYLE_URL;

// Default coordinates for USA (geographic center near Kansas)
// Format: [longitude, latitude]
export const DEFAULT_USA_COORDINATES: [number, number] = [-95.7129, 37.0902];

export const GlobalMapboxConfig = {
  accessToken: MAPBOX_ACCESS_TOKEN,
  styleURL: MAPBOX_STYLE_URL,
  compassEnabled: false,
  logoEnabled: false,
  attributionEnabled: false,
  zoomEnabled: true,
  rotateEnabled: true,
  pitchEnabled: true,
  userLocationEnabled: false,
  userLocationPitchAlignment: "auto",
  scaleBarEnabled: false,
  animationType: "flyTo",
  animationDuration: 500,
} as const;
