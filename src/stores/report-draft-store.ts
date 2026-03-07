import { create } from 'zustand';

export interface MediaSlot {
  id: string;
  uri: string | null;
}

const DEFAULT_MEDIA_SLOTS: MediaSlot[] = [
  { id: '1', uri: null },
  { id: '2', uri: null },
];

type ReportDraftState = {
  mediaSlots: MediaSlot[];
  mediaUris: string[];
};

type ReportDraftActions = {
  setMediaSlots: (slots: MediaSlot[]) => void;
  setMediaSlotUri: (index: number, uri: string | null) => void;
  setMediaUris: (uris: string[]) => void;
  removeMediaUriAt: (index: number) => void;
  reset: () => void;
};

const initialState: ReportDraftState = {
  mediaSlots: DEFAULT_MEDIA_SLOTS,
  mediaUris: [],
};

export const useReportDraftStore = create<ReportDraftState & ReportDraftActions>()((set) => ({
  ...initialState,
  setMediaSlots: (slots) => set({ mediaSlots: slots }),
  setMediaSlotUri: (index, uri) =>
    set((s) => ({
      mediaSlots: s.mediaSlots.map((slot, i) =>
        i === index ? { ...slot, uri } : slot
      ),
    })),
  setMediaUris: (uris) => set({ mediaUris: uris }),
  removeMediaUriAt: (index) =>
    set((s) => ({
      mediaUris: s.mediaUris.filter((_, i) => i !== index),
    })),
  reset: () => set(initialState),
}));
