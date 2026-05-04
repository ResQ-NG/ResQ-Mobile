import { create } from 'zustand';
import type { UiEmergencyContact } from '@/network/modules/emergency-contacts/utils';

type WatchMeContactsSheetState = {
  isOpen: boolean;
  /** When true, sheet will open in 'add' view (e.g. from contacts page Add button) */
  openWithAddView: boolean;
  /** When set, sheet opens in 'edit' with this contact prefilled */
  openWithEditContact: UiEmergencyContact | null;
};

type WatchMeContactsSheetActions = {
  open: () => void;
  /** Open sheet with add-contact form visible */
  openForAdd: () => void;
  /** Open sheet in edit mode for an existing contact */
  openForEdit: (contact: UiEmergencyContact) => void;
  close: () => void;
  clearOpenWithAddView: () => void;
  clearOpenWithEditContact: () => void;
};

export const useWatchMeContactsSheetStore = create<
  WatchMeContactsSheetState & WatchMeContactsSheetActions
>()((set) => ({
  isOpen: false,
  openWithAddView: false,
  openWithEditContact: null,
  open: () =>
    set({
      isOpen: true,
      openWithAddView: false,
      openWithEditContact: null,
    }),
  openForAdd: () =>
    set({
      isOpen: true,
      openWithAddView: true,
      openWithEditContact: null,
    }),
  openForEdit: (contact) =>
    set({
      isOpen: true,
      openWithAddView: false,
      openWithEditContact: contact,
    }),
  close: () =>
    set({
      isOpen: false,
      openWithAddView: false,
      openWithEditContact: null,
    }),
  clearOpenWithAddView: () => set({ openWithAddView: false }),
  clearOpenWithEditContact: () => set({ openWithEditContact: null }),
}));
