import { create } from 'zustand';

type CheckingSafetySheetState = {
  isOpen: boolean;
  progress: number;
  message: string;
};

type CheckingSafetySheetActions = {
  show: (options?: { message?: string; progress?: number }) => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
  hide: () => void;
};

const initialState: CheckingSafetySheetState = {
  isOpen: false,
  progress: 0,
  message: "Checking if you're safe...",
};

export const useCheckingSafetySheetStore = create<
  CheckingSafetySheetState & CheckingSafetySheetActions
>()((set) => ({
  ...initialState,

  show: ({ message = "Checking if you're safe...", progress = 0 } = {}) =>
    set({ isOpen: true, message, progress }),

  setProgress: (progress) => set({ progress }),
  setMessage: (message) => set({ message }),
  hide: () => set(initialState),
}));
