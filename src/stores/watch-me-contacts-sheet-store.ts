import { create } from 'zustand';

type WatchMeContactsSheetState = {
  isOpen: boolean;
  /** When true, sheet will open in 'add' view (e.g. from contacts page Add button) */
  openWithAddView: boolean;
};

type WatchMeContactsSheetActions = {
  open: () => void;
  /** Open sheet with add-contact form visible */
  openForAdd: () => void;
  close: () => void;
  clearOpenWithAddView: () => void;
};

export const useWatchMeContactsSheetStore = create<
  WatchMeContactsSheetState & WatchMeContactsSheetActions
>()((set) => ({
  isOpen: false,
  openWithAddView: false,
  open: () => set({ isOpen: true, openWithAddView: false }),
  openForAdd: () => set({ isOpen: true, openWithAddView: true }),
  close: () => set({ isOpen: false, openWithAddView: false }),
  clearOpenWithAddView: () => set({ openWithAddView: false }),
}));
