import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

/**
 * Sets up the React Query online manager to track internet connectivity status.
 * Uses @react-native-community/netinfo to listen for network changes and update
 * the onlineManager status accordingly. This enables React Query to respond
 * to offline/online transitions (such as pausing or resuming queries).
 */
export function setupOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state: NetInfoState) => {
      setOnline(!!state.isConnected);
    });
  });
}
