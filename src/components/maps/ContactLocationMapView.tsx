import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { GlobalMapboxConfig } from '@/lib/third-party/mapbox/constants';
import { AppConfig } from '@/lib/app-config';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarMapPointRotateBoldIcon from '@/components/icons/solar/map-point-rotate-bold';
import { useTheme } from '@/context/ThemeContext';
import { useAppColorScheme } from '@/theme/colorMode';

const MARKER_SIZE = 40;

if (AppConfig.MAPBOX_ACCESS_TOKEN) {
  MapboxGL.setAccessToken(AppConfig.MAPBOX_ACCESS_TOKEN);
}

export type ContactLocationMapViewProps = {
  /** [longitude, latitude] */
  coordinate: [number, number];
  name: string;
  avatarBgIndex?: number;
  /** Map container height. Default 200. */
  height?: number;
};

const GLASS_BUTTON_CLASS =
  'bg-[rgba(18,18,18,0.8)] border border-[rgba(255,255,255,0.18)]';

/**
 * Small map focused on a single contact's location for use in modals (e.g. Watch Me status).
 * Includes overlay and a reset-to-contact-location button so you can recenter after panning.
 */
export function ContactLocationMapView({
  coordinate,
  name,
  avatarBgIndex = 0,
  height = 200,
}: ContactLocationMapViewProps) {
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const markerRef = useRef<MapboxGL.PointAnnotation>(null);
  const { isDark } = useTheme();
  const { theme } = useAppColorScheme();

  const resetToContactLocation = useCallback(() => {
    if (!cameraRef.current) return;
    cameraRef.current.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: 15,
      animationDuration: 500,
    });
  }, [coordinate]);

  useEffect(() => {
    if (!cameraRef.current) return;
    cameraRef.current.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: 15,
      animationDuration: 400,
    });
  }, [coordinate]);

  return (
    <View style={[styles.container, { height }]}>
      <MapboxGL.MapView style={styles.map} {...GlobalMapboxConfig(isDark)}>
        <MapboxGL.Camera
          ref={cameraRef}
          followUserLocation={false}
          zoomLevel={15}
          centerCoordinate={coordinate}
          pitch={20}
          maxZoomLevel={50}
        />
        <MapboxGL.PointAnnotation
          ref={markerRef}
          id="contact-location"
          coordinate={coordinate}
        >
          <View
            style={styles.marker}
            onLayout={() => {
              markerRef.current?.refresh?.();
              setTimeout(() => markerRef.current?.refresh?.(), 150);
            }}
          >
            <Avatar
              altText={name}
              size={MARKER_SIZE - 8}
              backgroundColor={
                AVATAR_BACKGROUNDS[avatarBgIndex % AVATAR_BACKGROUNDS.length]
              }
            />
          </View>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      {/* Subtle overlay for depth */}
      <View pointerEvents="none" style={styles.overlay} />

      {/* Reset to contact location so user can recenter after panning */}
      <View style={styles.resetButtonWrap} pointerEvents="box-none">
        <RoundedButton
          onPress={resetToContactLocation}
          icon={
            <SolarMapPointRotateBoldIcon
              width={20}
              height={20}
              color={theme.iconOnAccent}
            />
          }
          className={GLASS_BUTTON_CLASS}
          accessibilityLabel="Center on contact"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
  },
  map: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 16,
    pointerEvents: 'none',
  },
  resetButtonWrap: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  marker: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
