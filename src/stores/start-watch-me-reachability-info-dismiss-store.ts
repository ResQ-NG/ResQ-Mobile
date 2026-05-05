import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = {
  /** User dismissed the reachability info callout on Start Watch Me. */
  dismissed: boolean;
};

type Actions = {
  dismiss: () => void;
};

export const useStartWatchMeReachabilityInfoDismissStore = create<
  State & Actions
>()(
  persist(
    (set) => ({
      dismissed: false,
      dismiss: () => set({ dismissed: true }),
    }),
    {
      name: 'resq-start-watch-me-reachability-info-dismiss',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ dismissed: state.dismissed }),
    }
  )
);
