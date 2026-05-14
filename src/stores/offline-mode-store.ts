import { create } from 'zustand';

type State = {
  /** True when the device has no network connection (NetInfo `isConnected === false`). */
  isOffline: boolean;
};

type Actions = {
  setOffline: (isOffline: boolean) => void;
};

export const useOfflineModeStore = create<State & Actions>((set) => ({
  isOffline: false,
  setOffline: (isOffline) => set({ isOffline }),
}));
