import { useAppHelpIntroStore } from '@/stores/app-help-intro-store';
import { useCapturedMediaStore } from '@/stores/captured-media-store';
import { useLocationStore } from '@/stores/location-store';
import { useStartWatchMeReachabilityInfoDismissStore } from '@/stores/start-watch-me-reachability-info-dismiss-store';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';

/**
 * Resets persisted Zustand state tied to the previous signed-in user so the next
 * session does not inherit onboarding flags, scratch media, etc.
 *
 * Does not modify auth token — callers clear that separately.
 */
export function resetPersistedSessionState(): void {
  useWatchMeContactsStore.setState({
    onboardingDismissedByUser: false,
    isSessionActive: false,
  });
  useAppHelpIntroStore.setState({ hasCompletedAppHelpIntro: false });
  useStartWatchMeReachabilityInfoDismissStore.setState({ dismissed: false });
  useCapturedMediaStore.getState().clear();
  useLocationStore.setState({ isLocationModalVisible: false });
}
