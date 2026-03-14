import { create, type StoreApi, type UseBoundStore } from 'zustand';

type InCallState = {
  isActive: boolean;
  callerName: string | null;
  /** When true, show the full in-call modal; when false, only the floating banner */
  isModalExpanded: boolean;
  /** When the call started (ms) for duration display */
  startedAt: number | null;
};

type InCallActions = {
  startCall: (options?: { callerName?: string }) => void;
  endCall: () => void;
  expandModal: () => void;
  minimizeModal: () => void;
};

const initialState: InCallState = {
  isActive: false,
  callerName: null,
  isModalExpanded: true,
  startedAt: null,
};

type InCallStore = InCallState & InCallActions;

export const useInCallStore: UseBoundStore<StoreApi<InCallStore>> =
  create<InCallStore>()((set) => ({
  ...initialState,

  startCall: (options) =>
    set({
      isActive: true,
      callerName: options?.callerName ?? null,
      isModalExpanded: true,
      startedAt: Date.now(),
    }),

  endCall: () => set(initialState),

  expandModal: () => set({ isModalExpanded: true }),
  minimizeModal: () => set({ isModalExpanded: false }),
}));
