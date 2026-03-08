import { create } from 'zustand';

type WatchMeContactsSheetState = {
  isOpen: boolean;
};

type WatchMeContactsSheetActions = {
  open: () => void;
  close: () => void;
};

export const useWatchMeContactsSheetStore = create<
  WatchMeContactsSheetState & WatchMeContactsSheetActions
>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
