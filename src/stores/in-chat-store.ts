import { create } from 'zustand';

type InChatState = {
  /** Agencies the user has an active chat with (can be multiple) */
  agencyNames: string[];
  /** Which agency's chat is currently open on the chat screen */
  currentAgencyName: string | null;
  /** When true, the chat screen is open; when false, only the floating banner is shown */
  isScreenExpanded: boolean;
};

type InChatActions = {
  startChat: (options: { agencyName: string }) => void;
  /** End the current chat (or the given agency). Removes from list; clears current if needed. */
  endChat: (agencyName?: string) => void;
  /** End all chats and dismiss banner */
  endAllChats: () => void;
  expandScreen: () => void;
  minimizeScreen: () => void;
  /** Set which agency to view; used when picking from the multi-agency sheet */
  selectAgencyForChat: (agencyName: string) => void;
};

const initialState: InChatState = {
  agencyNames: [],
  currentAgencyName: null,
  isScreenExpanded: true,
};

export const useInChatStore = create<InChatState & InChatActions>()((set) => ({
  ...initialState,

  startChat: ({ agencyName }) =>
    set((state) => {
      const next = state.agencyNames.includes(agencyName)
        ? state.agencyNames
        : [...state.agencyNames, agencyName];
      return {
        agencyNames: next,
        currentAgencyName: agencyName,
        isScreenExpanded: true,
      };
    }),

  endChat: (agencyName) =>
    set((state) => {
      const toRemove = agencyName ?? state.currentAgencyName;
      if (!toRemove) return state;
      const next = state.agencyNames.filter((a) => a !== toRemove);
      const nextCurrent =
        state.currentAgencyName === toRemove
          ? (next[0] ?? null)
          : state.currentAgencyName;
      return {
        agencyNames: next,
        currentAgencyName: next.length === 0 ? null : nextCurrent,
        isScreenExpanded: next.length === 0 ? false : state.isScreenExpanded,
      };
    }),

  endAllChats: () => set(initialState),

  expandScreen: () => set({ isScreenExpanded: true }),
  minimizeScreen: () => set({ isScreenExpanded: false }),

  selectAgencyForChat: (agencyName) =>
    set({ currentAgencyName: agencyName, isScreenExpanded: true }),
}));
