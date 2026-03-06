import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import { MAPBOX_ACCESS_TOKEN } from "./constants";
import { logger } from "@/lib/utils/logger";

const directionsClient = mbxDirections({ accessToken: MAPBOX_ACCESS_TOKEN as string });

// origin: [lng, lat], destination: [lng, lat]
export const fetchRoute = async (
  origin: [number, number],
  destination: [number, number]
) => {
  try {
    const response = await directionsClient
      .getDirections({
        profile: "driving-traffic", // 'driving', 'walking', 'cycling'
        waypoints: [
          { coordinates: origin as [number, number] },
          { coordinates: destination as [number, number] },
        ],
        geometries: "geojson",
        overview: "full",
        steps: true,
        bannerInstructions: true,
      })
      .send();

    const directions = response.body;

    if (directions.routes && directions.routes.length > 0) {
      const routeGeoJSON = {
        type: "Feature",
        properties: {},
        geometry: directions.routes[0].geometry,
      };

      // setRoute is not defined in this context; simply return result
      return routeGeoJSON;
    } else {
      // No routes found
      return null;
    }
  } catch (error) {
    logger.error("Error fetching route:", error);
    return null;
  }
};
