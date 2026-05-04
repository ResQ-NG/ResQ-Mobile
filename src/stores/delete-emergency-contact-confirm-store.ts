import { create } from 'zustand';

type ContactToDelete = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

type State = {
  isOpen: boolean;
  contact: ContactToDelete | null;
};

type Actions = {
  open: (contact: ContactToDelete) => void;
  close: () => void;
};

const initialState: State = {
  isOpen: false,
  contact: null,
};

export const useDeleteEmergencyContactConfirmStore = create<State & Actions>()(
  (set) => ({
    ...initialState,
    open: (contact) => set({ isOpen: true, contact }),
    close: () => set(initialState),
  })
);

