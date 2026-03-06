import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { GlobalMapboxConfig } from "@/lib/third-party/mapbox/constants";
import { AppConfig } from "@/lib/app-config";
import { Avatar } from "@/components/ui";
import SolarMapPointBoldIcon from "@/components/icons/solar/map-point-bold";
import { useFetchCoordinates } from "@/hooks/useFetchCoordinates";
import { useThemeColors } from "@/context/ThemeContext";

if (AppConfig.MAPBOX_ACCESS_TOKEN) {
  MapboxGL.setAccessToken(AppConfig.MAPBOX_ACCESS_TOKEN);
}

export const ExpandedMapView: React.FC = () => {
  const coordinates = useFetchCoordinates();
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const colors = useThemeColors();



  const resetToUserLocation = () => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: coordinates,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} {...GlobalMapboxConfig}>
        <MapboxGL.Camera
          ref={cameraRef}
          followUserLocation={false}
          zoomLevel={14}
          centerCoordinate={coordinates}
          pitch={30}
          maxZoomLevel={50}
        />

        {/* Route line */}


        {/* User location marker */}
        <MapboxGL.PointAnnotation id="user-location" coordinate={coordinates}>
          <View style={styles.userMarker}>
            <Avatar altText="John Doe" size={40} />
          </View>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      {/* Reset to user location button */}
      <TouchableOpacity
        style={[
          styles.resetButton,
          { backgroundColor: colors.surfaceBackground },
        ]}
        onPress={resetToUserLocation}
        activeOpacity={0.8}
        className="rounded-full"
      >
        <SolarMapPointBoldIcon
          width={24}
          height={24}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {/* Subtle overlay for depth */}
      <View pointerEvents="none" style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 20,
    pointerEvents: "none",
  },
  userMarker: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  destinationMarker: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EC6F52",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  resetButton: {
    position: "absolute",
    right: 16,
    bottom: "40%",
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
    padding: 8,
  },
});
