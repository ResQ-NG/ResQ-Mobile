import { create } from 'zustand';

export type RouteIssue = {
  id: string;
  label: string;
  count?: number;
};

type UnsafeRouteSheetState = {
  isOpen: boolean;
  fromLabel: string;
  toLabel: string;
  issues: RouteIssue[];
};

type UnsafeRouteSheetActions = {
  open: (params: {
    fromLabel?: string;
    toLabel: string;
    issues: RouteIssue[];
  }) => void;
  close: () => void;
};

const initialState: UnsafeRouteSheetState = {
  isOpen: true,
  fromLabel: 'Current location',
  toLabel: '',
  issues: [
    { id: '1', label: 'Unsuccessful Watch Me sessions', count: 4 },
    { id: '2', label: 'Recorded auto accident', count: 1 },
    { id: '3', label: 'Late check-ins reported', count: 2 },
  ],
};

export const useUnsafeRouteSheetStore = create<
  UnsafeRouteSheetState & UnsafeRouteSheetActions
>()((set) => ({
  ...initialState,

  open: ({ fromLabel = 'Current location', toLabel, issues }) =>
    set({
      isOpen: true,
      fromLabel,
      toLabel,
      issues,
    }),

  close: () => set(initialState),
}));
