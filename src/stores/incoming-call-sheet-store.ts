import { create } from 'zustand';

type IncomingCallSheetState = {
  isOpen: boolean;
  callerName: string | null;
};

type IncomingCallSheetActions = {
  open: (options: { callerName: string }) => void;
  close: () => void;
};

const initialState: IncomingCallSheetState = {
  isOpen: false,
  callerName: null,
};

export const useIncomingCallSheetStore = create<
  IncomingCallSheetState & IncomingCallSheetActions
>()((set) => ({
  ...initialState,
  open: ({ callerName }) => set({ isOpen: true, callerName }),
  close: () => set(initialState),
}));
