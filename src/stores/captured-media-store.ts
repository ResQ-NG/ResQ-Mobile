import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CapturedMediaItem {
  id: string;
  uri: string;
  createdAt: number;
}

type CapturedMediaState = {
  items: CapturedMediaItem[];
};

type CapturedMediaActions = {
  addMedia: (uri: string) => void;
  removeMedia: (id: string) => void;
  clear: () => void;
};

const initialState: CapturedMediaState = {
  items: [],
};

export const useCapturedMediaStore = create<
  CapturedMediaState & CapturedMediaActions
>()(
  persist(
    (set) => ({
      ...initialState,
      addMedia: (uri) =>
        set((state) => ({
          items: [
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              uri,
              createdAt: Date.now(),
            },
            ...state.items,
          ].slice(0, 20), // keep last 20 for the strip
        })),
      removeMedia: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clear: () => set(initialState),
    }),
    {
      name: 'resq-captured-media-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
