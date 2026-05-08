import { create } from 'zustand';

export type TabBadgeKey = 'watchme';

type State = {
  /** When false, no badges/dots are rendered anywhere. */
  badgesEnabled: boolean;
  watchMeHasUnread: boolean;
  notificationsHasUnread: boolean;
};

type Actions = {
  setBadgesEnabled: (enabled: boolean) => void;
    markWatchMeUnread: () => void;
  clearWatchMeUnread: () => void;
  addUnreadBadgeToNotifications: () => void;
  removeUnreadBadgeFromNotifications: () => void;
};

const initialState: State = {
  badgesEnabled: true,
  watchMeHasUnread: false,
  notificationsHasUnread: false,
};

export const useTabBadgesStore = create<State & Actions>()((set) => ({
  ...initialState,
  setBadgesEnabled: (enabled) => set({ badgesEnabled: enabled }),
  markWatchMeUnread: () => set({ watchMeHasUnread: true }),
  clearWatchMeUnread: () => set({ watchMeHasUnread: false }),
  addUnreadBadgeToNotifications: () => set({ notificationsHasUnread: true }),
  removeUnreadBadgeFromNotifications: () => set({ notificationsHasUnread: false }),
}));
