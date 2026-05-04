import { create } from 'zustand';

export type AppModalState = 'loading' | 'sharing';

type AppModalStore = {
  isOpen: boolean;
  state: AppModalState;
  /** 0–100, for loading state */
  progress: number;
  /** Main message (e.g. "Posting...") */
  message: string;
  /** For sharing state: optional title */
  sharingTitle?: string;
  /** For sharing state: optional extra message/body */
  sharingMessage?: string;
};

type AppModalActions = {
  showLoading: (options: { message?: string; progress?: number }) => void;
  showSharing: (options: {
    message?: string;
    title?: string;
    sharingMessage?: string;
  }) => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
  hide: () => void;
};

const initialState: AppModalStore = {
  isOpen: false,
  state: 'loading',
  progress: 0,
  message: '',
  sharingTitle: undefined,
  sharingMessage: undefined,
};

export const useAppModalStore = create<AppModalStore & AppModalActions>()(
  (set) => ({
    ...initialState,

    showLoading: ({ message = 'Posting...', progress = 0 }) =>
      set({
        isOpen: true,
        state: 'loading',
        message,
        progress,
        sharingTitle: undefined,
        sharingMessage: undefined,
      }),

    showSharing: ({ message = 'Sharing', title, sharingMessage }) =>
      set({
        isOpen: true,
        state: 'sharing',
        message,
        sharingTitle: title,
        sharingMessage,
        progress: 0,
      }),

    setProgress: (progress) => set({ progress }),
    setMessage: (message) => set({ message }),
    hide: () => set(initialState),
  })
);
