import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { logger } from "@/lib/utils/logger";
import { useLocationStore } from "@/stores/location-store";
import { router } from "expo-router";
import { DEFAULT_USA_COORDINATES } from "@/lib/third-party/mapbox/constants";

/**
 * useFetchCoordinates
 *
 * Hook to get the current device location as longitude and latitude coordinates.
 * Returns user's actual location if permission is granted, otherwise returns default USA coordinates.
 * Provides only the coordinates state, automatically updates on mount.
 *
 * Example usage:
 *   const coordinates = useFetchCoordinates();
 *   // coordinates is [longitude, latitude] - always returns a value (never null)
 */
export const useFetchCoordinates = () => {
  const [coordinates, setCoordinates] = useState<[number, number]>(
    DEFAULT_USA_COORDINATES
  );
  const isLocationModalVisible = useLocationStore((s) => s.isLocationModalVisible);
  const setLocationEnabled = useLocationStore((s) => s.setLocationEnabled);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationEnabled({ isLocationModalVisible: true });
          router.push("/(modals)/enable-location");
          // Keep default USA coordinates
          setCoordinates(DEFAULT_USA_COORDINATES);
          return;
        }

        // Get current position if permission is granted
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const coords: [number, number] = [
          currentLocation.coords.longitude,
          currentLocation.coords.latitude,
        ];
        setCoordinates(coords);
      } catch (err) {
        logger.error("Error fetching current location coordinates:", err);
        setLocationEnabled({ isLocationModalVisible: true });
        router.push("/(modals)/enable-location");
        // Keep default USA coordinates on error
        setCoordinates(DEFAULT_USA_COORDINATES);
      }
    };

    getCoordinates();
  }, [setLocationEnabled]);

  // Re-fetch coordinates when location modal is dismissed and permission was granted
  useEffect(() => {
    if (!isLocationModalVisible) {
      const refetchCoordinates = async () => {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === "granted") {
            const currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            const coords: [number, number] = [
              currentLocation.coords.longitude,
              currentLocation.coords.latitude,
            ];
            setCoordinates(coords);
          } else {
            // Keep showing USA if permission still not granted
            setCoordinates(DEFAULT_USA_COORDINATES);
          }
        } catch (err) {
          logger.error("Error refetching coordinates:", err);
          setCoordinates(DEFAULT_USA_COORDINATES);
        }
      };
      refetchCoordinates();
    }
  }, [isLocationModalVisible]);

  return coordinates;
};
