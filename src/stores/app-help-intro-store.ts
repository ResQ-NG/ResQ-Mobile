import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AppHelpIntroState = {
  /** True after the user finishes or dismisses the Report / Watch Me / SOS / Broadcast slides. */
  hasCompletedAppHelpIntro: boolean;
};

type AppHelpIntroActions = {
  markAppHelpIntroCompleted: () => void;
};

export const useAppHelpIntroStore = create<
  AppHelpIntroState & AppHelpIntroActions
>()(
  persist(
    (set) => ({
      hasCompletedAppHelpIntro: false,
      markAppHelpIntroCompleted: () => set({ hasCompletedAppHelpIntro: true }),
    }),
    {
      name: 'resq-app-help-intro',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedAppHelpIntro: state.hasCompletedAppHelpIntro,
      }),
    }
  )
);
