import { create } from 'zustand';

export type SosEvidenceType = 'image' | 'video' | 'voice' | 'text';

export interface SosEvidenceItem {
  id: string;
  createdAt: number;
  type: SosEvidenceType;
  /** For image/video/voice. Empty for text-only or placeholder voice. */
  uri?: string;
  /** For text items, or label for voice (e.g. "Voice note"). */
  text?: string;
}

type SosEvidenceState = {
  items: SosEvidenceItem[];
};

type SosEvidenceActions = {
  addMedia: (uri: string, type: 'image' | 'video') => void;
  addVoiceNote: (uri?: string) => void;
  addTextNote: (text: string) => void;
  removeMedia: (id: string) => void;
  clear: () => void;
};

const initialState: SosEvidenceState = {
  items: [],
};

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useSosEvidenceStore = create<
  SosEvidenceState & SosEvidenceActions
>()((set) => ({
  ...initialState,
  addMedia: (uri, type) =>
    set((state) => ({
      items: [
        { id: makeId(), uri, createdAt: Date.now(), type },
        ...state.items,
      ].slice(0, 50),
    })),
  addVoiceNote: (uri) =>
    set((state) => ({
      items: [
        {
          id: makeId(),
          uri: uri ?? '',
          createdAt: Date.now(),
          type: 'voice',
          text: 'Voice note',
        },
        ...state.items,
      ].slice(0, 50),
    })),
  addTextNote: (text) =>
    set((state) => ({
      items: [
        { id: makeId(), createdAt: Date.now(), type: 'text', text },
        ...state.items,
      ].slice(0, 50),
    })),
  removeMedia: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clear: () => set(initialState),
}));
