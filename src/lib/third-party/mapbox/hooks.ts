import { useQuery } from "@tanstack/react-query";
import { fetchRoute } from "./utils";

/**
 * useMapboxRoute
 *
 * Hook to fetch the route between two coordinates using the Mapbox Directions API.
 *
 * @param coordinates - The origin coordinates [longitude, latitude]
 * @param destinationCoordinates - The destination coordinates [longitude, latitude]
 * @returns The route data
 */
export const useMapboxRoute = (
  coordinates: [number, number] | null,
  destinationCoordinates: [number, number] | null
) => {
  return useQuery({
    queryKey: ["mapbox-route", coordinates, destinationCoordinates],
    queryFn: async () => {
      if (!coordinates || !destinationCoordinates) return null;
      return await fetchRoute(coordinates, destinationCoordinates);
    },
    enabled: !!coordinates && !!destinationCoordinates,
  });
};
