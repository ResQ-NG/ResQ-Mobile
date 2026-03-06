import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { focusManager } from "@tanstack/react-query";

/**
 * Sets up the React Query focus manager to track the application's foreground/background status.
 * When the app is active (i.e., in the foreground), it marks queries as focused, triggering
 * them to refetch or resume. When the app is not active, it marks queries as unfocused,
 * allowing React Query to pause query activity and conserve resources.
 *
 * This is important for mobile apps because focus events differ from web,
 * and ensures data stays fresh when the user comes back to the app.
 *
 * @returns A cleanup function to remove the AppState event listener.
 */
export function setupFocusManager() {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  const subscription = AppState.addEventListener("change", onAppStateChange);

  return () => subscription.remove();
}

/**
 * React hook to initialize the React Query focus manager for app state changes.
 * Should be used once at the root of the app (or provider scope) to wire up
 * the React Query focus lifecycle to React Native's AppState events.
 */
export function useFocusManager() {
  useEffect(() => {
    const cleanup = setupFocusManager();
    return cleanup;
  }, []);
}
