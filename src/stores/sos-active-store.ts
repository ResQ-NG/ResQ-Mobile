import { create } from 'zustand';

type State = {
  isActive: boolean;
};

type Actions = {
  setActive: () => void;
  setInactive: () => void;
};

export const useSosActiveStore = create<State & Actions>()((set) => ({
  isActive: false,
  setActive: () => set({ isActive: true }),
  setInactive: () => set({ isActive: false }),
}));
