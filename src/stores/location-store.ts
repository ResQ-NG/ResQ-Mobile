import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LocationState = {
  isLocationModalVisible: boolean;
};

type LocationActions = {
  setLocationModalVisible: (visible: boolean) => void;
  setLocationEnabled: (state: Partial<LocationState>) => void;
};

const initialState: LocationState = {
  isLocationModalVisible: false,
};

export const useLocationStore = create<LocationState & LocationActions>()(
  persist(
    (set) => ({
      ...initialState,
      setLocationModalVisible: (visible) =>
        set({ isLocationModalVisible: visible }),
      setLocationEnabled: (next) => set((s) => ({ ...s, ...next })),
    }),
    {
      name: 'resq-location-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ isLocationModalVisible: s.isLocationModalVisible }),
    }
  )
);
