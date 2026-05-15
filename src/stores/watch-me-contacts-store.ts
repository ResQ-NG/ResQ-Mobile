import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WatchMeContactsState = {
  /** When true, user pressed back on onboarding; don't auto-redirect to onboarding when they have 0 contacts */
  onboardingDismissedByUser: boolean;
  /** When true, user has started a Watch Me session (sharing location with contacts) */
  isSessionActive: boolean;
  /** Unix timestamp (ms) when the session was started */
  sessionStartedAt: number | null;
  /** IDs of contacts actively watching this session */
  sessionContactIds: string[];
};

type WatchMeContactsActions = {
  setOnboardingDismissedByUser: (dismissed: boolean) => void;
  setSessionActive: (active: boolean) => void;
  startSession: (contactIds: string[]) => void;
  endSession: () => void;
};

const initialState: WatchMeContactsState = {
  onboardingDismissedByUser: false,
  isSessionActive: false,
  sessionStartedAt: null,
  sessionContactIds: [],
};

export const useWatchMeContactsStore = create<
  WatchMeContactsState & WatchMeContactsActions
>()(
  persist(
    (set) => ({
      ...initialState,

      setOnboardingDismissedByUser: (dismissed) =>
        set({ onboardingDismissedByUser: dismissed }),

      setSessionActive: (active) =>
        set(active ? { isSessionActive: true } : {
          isSessionActive: false,
          sessionStartedAt: null,
          sessionContactIds: [],
        }),

      startSession: (contactIds) =>
        set({
          isSessionActive: true,
          sessionStartedAt: Date.now(),
          sessionContactIds: contactIds,
        }),

      endSession: () =>
        set({
          isSessionActive: false,
          sessionStartedAt: null,
          sessionContactIds: [],
        }),
    }),
    {
      name: 'resq-watchme-contacts-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onboardingDismissedByUser: state.onboardingDismissedByUser,
        isSessionActive: state.isSessionActive,
        sessionStartedAt: state.sessionStartedAt,
        sessionContactIds: state.sessionContactIds,
      }),
    }
  )
);
