import { QueryClient } from "@tanstack/react-query";

/**
 * Clears all cached query data from React Query.
 * This is useful for sign out or when you need to reset the entire cache.
 * @param queryClient - The QueryClient instance to clear
 */
export const wipeQueryKeys = async (
  queryClient: QueryClient
): Promise<void> => {
  try {
    // Clear all queries from the cache
    queryClient.clear();
    // Optionally, you can also cancel all ongoing queries
    queryClient.cancelQueries();
  } catch (error) {
    console.error("Error wiping query keys:", error);
  }
};
