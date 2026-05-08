import { create } from 'zustand';

export type WebsocketMessage = {
  type: string;
  event?: string;
  data: Record<string, unknown>;
  timestamp: number;
};

type WebsocketStoreState = {
  /** Latest messages first. */
  messages: WebsocketMessage[];
  /** Convenience pointer for event handling. */
  lastMessage: WebsocketMessage | null;
  /** `react-use-websocket` readyState number (see lib constants). */
  readyState: number;
  /** Sender registered by the active websocket connection (if mounted). */
  sendJsonMessage: ((message: unknown) => void) | null;
  /** Rooms/channels the client wants to receive. */
  subscribedGroups: string[];
};

type WebsocketStoreActions = {
  pushMessage: (message: WebsocketMessage) => void;
  clearMessages: () => void;
  setReadyState: (readyState: number) => void;
  setSendJsonMessage: (sender: ((message: unknown) => void) | null) => void;
  subscribeGroup: (group: string) => void;
  unsubscribeGroup: (group: string) => void;
  clearGroups: () => void;
  /** Adds group to state and sends subscribe if socket is available. */
  subscribeToGroup: (group: string) => void;
  /** Removes group from state and sends unsubscribe if socket is available. */
  unsubscribeFromGroup: (group: string) => void;
};

const initialState: WebsocketStoreState = {
  messages: [],
  lastMessage: null,
  readyState: 0,
  sendJsonMessage: null,
  subscribedGroups: [],
};

export const useWebsocketStore = create<WebsocketStoreState & WebsocketStoreActions>()(
  (set, get) => ({
    ...initialState,
    pushMessage: (message) =>
      set((state) => ({
        lastMessage: message,
        messages: [message, ...state.messages].slice(0, 200),
      })),
    clearMessages: () => set({ messages: [] }),
    setReadyState: (readyState) => set({ readyState }),
    setSendJsonMessage: (sender) => set({ sendJsonMessage: sender }),
    subscribeGroup: (group) =>
      set((state) => {
        const g = group.trim();
        if (!g) return state;
        if (state.subscribedGroups.includes(g)) return state;
        return { subscribedGroups: [...state.subscribedGroups, g] };
      }),
    unsubscribeGroup: (group) =>
      set((state) => ({
        subscribedGroups: state.subscribedGroups.filter((g) => g !== group),
      })),
    clearGroups: () => set({ subscribedGroups: [] }),
    subscribeToGroup: (room) => {
      const g = room.trim();
      if (!g) return;
      get().subscribeGroup(g);
      const sender = get().sendJsonMessage;
      sender?.({ type: 'subscribe', room: g });
    },
    unsubscribeFromGroup: (room) => {
      const g = room.trim();
      if (!g) return;
      get().unsubscribeGroup(g);
      const sender = get().sendJsonMessage;
      sender?.({ type: 'unsubscribe', room: g });
    },
  })
);

