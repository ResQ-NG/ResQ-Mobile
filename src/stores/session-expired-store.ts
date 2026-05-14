import { create } from 'zustand';

type State = {
  isOpen: boolean;
};

type Actions = {
  open: () => void;
  close: () => void;
};

const initialState: State = {
  isOpen: false,
};

export const useSessionExpiredStore = create<State & Actions>()((set) => ({
  ...initialState,
  open: () => set({ isOpen: true }),
  close: () => set(initialState),
}));
