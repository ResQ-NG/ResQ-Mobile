import { create } from 'zustand';

export type InviteContactSheetPayload = {
  id: string;
  name: string;
  avatarUrl: string | null;
  /** E.164 or national; used for optional SMS later */
  phone: string;
};

type State = {
  isOpen: boolean;
  contact: InviteContactSheetPayload | null;
};

type Actions = {
  open: (contact: InviteContactSheetPayload) => void;
  close: () => void;
};

const initial: State = {
  isOpen: false,
  contact: null,
};

export const useInviteContactSheetStore = create<State & Actions>()((set) => ({
  ...initial,
  open: (contact) => set({ isOpen: true, contact }),
  close: () => set(initial),
}));
