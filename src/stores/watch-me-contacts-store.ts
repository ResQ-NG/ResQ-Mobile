import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WatchMeContactsState = {
  /** When true, user pressed back on onboarding; don't auto-redirect to onboarding when they have 0 contacts */
  onboardingDismissedByUser: boolean;
  /** When true, user has started a Watch Me session (sharing location with contacts) */
  isSessionActive: boolean;
};

type WatchMeContactsActions = {
  setOnboardingDismissedByUser: (dismissed: boolean) => void;
  setSessionActive: (active: boolean) => void;
};

const initialState: WatchMeContactsState = {
  onboardingDismissedByUser: false,
  isSessionActive: false,
};

export const useWatchMeContactsStore = create<
  WatchMeContactsState & WatchMeContactsActions
>()(
  persist(
    (set) => ({
      ...initialState,

      setOnboardingDismissedByUser: (dismissed) =>
        set({ onboardingDismissedByUser: dismissed }),
      setSessionActive: (active) => set({ isSessionActive: active }),
    }),
    {
      name: 'resq-watchme-contacts-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onboardingDismissedByUser: state.onboardingDismissedByUser,
        isSessionActive: state.isSessionActive,
      }),
    }
  )
);
