import { create } from 'zustand';
import type { MockRoute } from '@/lib/mock/watchMeRouteSafetyMock';

type State = {
  origin: string;
  destination: string;
  selectedRoute: MockRoute | null;
  analysisComplete: boolean;
};

type Actions = {
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setSelectedRoute: (route: MockRoute | null) => void;
  setAnalysisComplete: (complete: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  origin: '',
  destination: '',
  selectedRoute: null,
  analysisComplete: false,
};

export const useRouteAnalysisStore = create<State & Actions>((set) => ({
  ...initialState,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  setAnalysisComplete: (complete) => set({ analysisComplete: complete }),
  reset: () => set(initialState),
}));
