import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const initialState: WatchMeContactsState = {
  contacts: [],
  onboardingDismissedByUser: false,
  isSessionActive: false,
};

export const useWatchMeContactsStore = create<
  WatchMeContactsState & WatchMeContactsActions
>()(
  persist(
    (set) => ({
      ...initialState,

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
    }),
    {
      name: 'resq-watchme-contacts-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

