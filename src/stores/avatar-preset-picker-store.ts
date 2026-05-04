import { create } from 'zustand';
import type { AvatarPreset } from '@/network/modules/auth/types';

type OnPick = (preset: AvatarPreset) => void;

type AvatarPresetPickerState = {
  isOpen: boolean;
  onPick: OnPick | null;
};

type AvatarPresetPickerActions = {
  open: (onPick: OnPick) => void;
  pick: (preset: AvatarPreset) => void;
  close: () => void;
};

const initial: AvatarPresetPickerState = {
  isOpen: false,
  onPick: null,
};

export const useAvatarPresetPickerStore = create<
  AvatarPresetPickerState & AvatarPresetPickerActions
>()((set, get) => ({
  ...initial,

  open: (onPick) => set({ isOpen: true, onPick }),

  pick: (preset) => {
    const { onPick } = get();
    set({ isOpen: false, onPick: null });
    onPick?.(preset);
  },

  close: () => set(initial),
}));
