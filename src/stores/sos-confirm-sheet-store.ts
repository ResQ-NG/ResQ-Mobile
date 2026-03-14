import { create } from 'zustand';

type SosConfirmSheetState = {
  isOpen: boolean;
};

type SosConfirmSheetActions = {
  open: () => void;
  close: () => void;
};

const initialState: SosConfirmSheetState = {
  isOpen: false,
};

export const useSosConfirmSheetStore = create<
  SosConfirmSheetState & SosConfirmSheetActions
>()((set) => ({
  ...initialState,
  open: () => set({ isOpen: true }),
  close: () => set(initialState),
}));
