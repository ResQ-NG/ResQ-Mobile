import { create } from 'zustand';
import type { EmergencyContact } from '@/components/watchme/WatchMeSheetContactList';

type WatchMeContactsState = {
  contacts: EmergencyContact[];
  /** When true, user pressed back on onboarding; don't auto-redirect to onboarding when they have 0 contacts */
  onboardingDismissedByUser: boolean;
  /** When true, user has started a Watch Me session (sharing location with contacts) */
  isSessionActive: boolean;
};

type WatchMeContactsActions = {
  setContacts: (contacts: EmergencyContact[]) => void;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeContact: (id: string) => void;
  setOnboardingDismissedByUser: (dismissed: boolean) => void;
  setSessionActive: (active: boolean) => void;
};

export const useWatchMeContactsStore = create<
  WatchMeContactsState & WatchMeContactsActions
>()((set) => ({
  contacts: [],
  onboardingDismissedByUser: false,
  isSessionActive: true,

  setContacts: (contacts) => set({ contacts }),

  addContact: (contact) =>
    set((state) => ({
      contacts: [
        ...state.contacts,
        { ...contact, id: String(Date.now()) },
      ],
    })),

  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  setOnboardingDismissedByUser: (dismissed) =>
    set({ onboardingDismissedByUser: dismissed }),
  setSessionActive: (active) => set({ isSessionActive: active }),
}));
