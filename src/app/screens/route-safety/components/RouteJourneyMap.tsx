import { useEffect, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { GlobalMapboxConfig } from '@/lib/third-party/mapbox/constants';
import { AppConfig } from '@/lib/app-config';
import { useTheme } from '@/context/ThemeContext';
import type { MockRoute } from '@/lib/mock/watchMeRouteSafetyMock';

if (AppConfig.MAPBOX_ACCESS_TOKEN) {
  MapboxGL.setAccessToken(AppConfig.MAPBOX_ACCESS_TOKEN);
}

type RouteJourneyMapProps = {
  route: MockRoute;
  origin: [number, number];
  destination: [number, number];
  /** Fixed height for collapsed preview; omit for flex fill (fullscreen). */
  height?: number;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function RouteJourneyMap({
  route,
  origin,
  destination,
  height,
  interactive = false,
  style,
}: RouteJourneyMapProps) {
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const originMarkerRef = useRef<MapboxGL.PointAnnotation>(null);
  const destMarkerRef = useRef<MapboxGL.PointAnnotation>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    cameraRef.current?.setCamera({
      centerCoordinate: route.mapCenter,
      zoomLevel: route.mapZoom,
      animationDuration: 450,
    });
  }, [route.id, route.mapCenter, route.mapZoom]);

  const mapConfig = {
    ...GlobalMapboxConfig(isDark),
    zoomEnabled: interactive,
    rotateEnabled: interactive,
    pitchEnabled: interactive,
    scrollEnabled: interactive,
  };

  const lineCoordinates =
    route.polyline && route.polyline.length >= 2
      ? route.polyline
      : [origin, route.mapCenter, destination];

  return (
    <View
      style={[
        styles.container,
        height != null ? { height } : styles.flexFill,
        style,
      ]}
    >
      <MapboxGL.MapView style={styles.map} {...mapConfig}>
        <MapboxGL.Camera ref={cameraRef} />

        <MapboxGL.ShapeSource
          id={`route-line-${route.id}`}
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: lineCoordinates,
            },
          }}
        >
          <MapboxGL.LineLayer
            id={`route-line-layer-${route.id}`}
            style={{
              lineColor: route.accentColor,
              lineWidth: interactive ? 4 : 3,
              lineOpacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </MapboxGL.ShapeSource>

        <MapboxGL.PointAnnotation
          ref={originMarkerRef}
          id={`origin-${route.id}`}
          coordinate={origin}
        >
          <View
            style={[styles.dot, { backgroundColor: '#22c55e' }]}
            onLayout={() => originMarkerRef.current?.refresh?.()}
          />
        </MapboxGL.PointAnnotation>

        <MapboxGL.PointAnnotation
          ref={destMarkerRef}
          id={`dest-${route.id}`}
          coordinate={destination}
        >
          <View
            style={[styles.dot, styles.destDot, { borderColor: route.accentColor }]}
            onLayout={() => destMarkerRef.current?.refresh?.()}
          />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      <View pointerEvents="none" style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#0a1628',
  },
  flexFill: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  destDot: {
    backgroundColor: '#fff',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
  },
});
