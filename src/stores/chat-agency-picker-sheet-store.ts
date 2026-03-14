import { create } from 'zustand';

type ChatAgencyPickerSheetState = {
  isOpen: boolean;
};

type ChatAgencyPickerSheetActions = {
  open: () => void;
  close: () => void;
};

const initialState: ChatAgencyPickerSheetState = {
  isOpen: false,
};

export const useChatAgencyPickerSheetStore = create<
  ChatAgencyPickerSheetState & ChatAgencyPickerSheetActions
>()((set) => ({
  ...initialState,
  open: () => set({ isOpen: true }),
  close: () => set(initialState),
}));
