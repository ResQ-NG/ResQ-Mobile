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
  isOpen: false,
  fromLabel: 'Current location',
  toLabel: '',
  issues: [],
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
