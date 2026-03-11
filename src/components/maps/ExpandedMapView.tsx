import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { GlobalMapboxConfig } from '@/lib/third-party/mapbox/constants';
import { AppConfig } from '@/lib/app-config';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui';
import { useFetchCoordinates } from '@/hooks/useFetchCoordinates';
import { useTheme } from '@/context/ThemeContext';

const MARKER_SIZE = 48;

if (AppConfig.MAPBOX_ACCESS_TOKEN) {
  MapboxGL.setAccessToken(AppConfig.MAPBOX_ACCESS_TOKEN);
}

export type WatchMapItem = {
  id: string;
  name: string;
  avatarBgIndex?: number;
  coordinates: [number, number];
};

type ExpandedMapViewProps = {
  resetLocation: React.RefObject<(() => void) | null>;
  /** Contacts currently sharing Watch Me on the map; when focused, only the focused one is shown */
  watchesOnMap?: WatchMapItem[];
  /** When set, map shows only this contact's marker and camera focuses on them */
  focusedWatchId?: string | null;
};

export const ExpandedMapView: React.FC<ExpandedMapViewProps> = ({
  resetLocation,
  watchesOnMap = [],
  focusedWatchId = null,
}) => {
  const coordinates = useFetchCoordinates();
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const userMarkerRef = useRef<MapboxGL.PointAnnotation>(null);
  const watchMarkerRefs = useRef<Record<string, MapboxGL.PointAnnotation | null>>({});
  const { isDark } = useTheme();

  const resetToUserLocation = useCallback(() => {
    if (!cameraRef.current) return;
    cameraRef.current.setCamera({
      centerCoordinate: coordinates,
      zoomLevel: 16,
      animationDuration: 500,
    });
  }, [coordinates]);

  useEffect(() => {
    if (resetLocation) {
      resetLocation.current = resetToUserLocation;
    }
    return () => {
      if (resetLocation) resetLocation.current = null;
    };
  }, [resetLocation, resetToUserLocation]);

  const markersToShow =
    focusedWatchId != null
      ? watchesOnMap.filter((w) => w.id === focusedWatchId)
      : watchesOnMap;

  useEffect(() => {
    if (focusedWatchId == null || !cameraRef.current) return;
    const watch = watchesOnMap.find((w) => w.id === focusedWatchId);
    if (!watch?.coordinates) return;
    cameraRef.current.setCamera({
      centerCoordinate: watch.coordinates,
      zoomLevel: 16,
      animationDuration: 500,
    });
  }, [focusedWatchId, watchesOnMap]);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} {...GlobalMapboxConfig(isDark)}>
        <MapboxGL.Camera
          ref={cameraRef}
          followUserLocation={false}
          zoomLevel={14}
          centerCoordinate={coordinates}
          pitch={30}
          maxZoomLevel={50}
        />

        {/* User location marker – hide when focused on a contact so only that contact is on map */}
        {focusedWatchId == null && (
          <MapboxGL.PointAnnotation
            ref={userMarkerRef}
            id="user-location"
            coordinate={coordinates}
          >
            <View
              style={styles.userMarker}
              onLayout={() => {
                userMarkerRef.current?.refresh?.();
                setTimeout(() => userMarkerRef.current?.refresh?.(), 150);
              }}
            >
              <Avatar
                altText="John Doe"
                size={40}
                backgroundColor={AVATAR_BACKGROUNDS[0]}
              />
            </View>
          </MapboxGL.PointAnnotation>
        )}

        {/* Contact Watch Me markers – only show when available on map; when focused, only that one */}
        {markersToShow.map((watch) => (
          <MapboxGL.PointAnnotation
            key={watch.id}
            ref={(r) => {
              watchMarkerRefs.current[watch.id] = r;
            }}
            id={`watch-${watch.id}`}
            coordinate={watch.coordinates}
          >
            <View
              style={styles.userMarker}
              onLayout={() => {
                watchMarkerRefs.current[watch.id]?.refresh?.();
                setTimeout(() => watchMarkerRefs.current[watch.id]?.refresh?.(), 150);
              }}
            >
              <Avatar
                altText={watch.name}
                size={40}
                backgroundColor={
                  AVATAR_BACKGROUNDS[
                    (watch.avatarBgIndex ?? 0) % AVATAR_BACKGROUNDS.length
                  ]
                }
              />
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      {/* Subtle overlay for depth */}
      <View pointerEvents="none" style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 20,
    pointerEvents: 'none',
  },
  userMarker: {
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
