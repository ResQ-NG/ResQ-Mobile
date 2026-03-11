import { create } from 'zustand';

export type AppToastVariant = 'default' | 'success' | 'error';

export type AppToast = {
  id: string;
  message: string;
  variant?: AppToastVariant;
  /** Set by store when auto-dismiss timer fires; view uses this to run fade-out then calls hideToast. */
  exiting?: boolean;
};

type AppToastState = {
  toasts: AppToast[];
};

type AppToastActions = {
  showToast: (
    toast: Omit<AppToast, 'id' | 'exiting'> & { id?: string; durationMs?: number }
  ) => string;
  hideToast: (id: string) => void;
  setExiting: (id: string) => void;
  clearToasts: () => void;
};

const initialState: AppToastState = {
  toasts: [],
};

const DEFAULT_DURATION_MS = 2500;

export const useAppToastStore = create<AppToastState & AppToastActions>()(
  (set, get) => ({
    ...initialState,
    showToast: ({ id: maybeId, durationMs = DEFAULT_DURATION_MS, ...toast }) => {
      const id =
        maybeId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      set((state) => ({
        toasts: [
          ...state.toasts,
          {
            ...toast,
            id,
            exiting: false,
          },
        ],
      }));

      const timeout = setTimeout(() => {
        get().setExiting(id);
      }, durationMs);
      clearTimeout(timeout);
      return id;
    },
    setExiting: (id) =>
      set((state) => ({
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, exiting: true } : t
        ),
      })),
    hideToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
    clearToasts: () => set(initialState),
  })
);
