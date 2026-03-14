import { useCallback } from 'react';
import { useCheckingSafetySheetStore } from '@/stores/checking-safety-sheet-store';
import type { RouteIssue } from '@/stores/unsafe-route-sheet-store';

/** Simulated delay (ms) for the route check; replace with real API later. */
const CHECK_DURATION_MS = 2500;

/** Simulate unsafe route ~90% of the time for demo; replace with real API result. */
const SIMULATE_UNSAFE_CHANCE = 0.5;

const MOCK_UNSAFE_ISSUES: RouteIssue[] = [
  { id: '1', label: 'Unsuccessful Watch Me sessions', count: 4 },
  { id: '2', label: 'Recorded auto accident', count: 1 },
  { id: '3', label: 'Late check-ins reported', count: 2 },
];

export type RouteSafetyResult = {
  safe: boolean;
  issues?: RouteIssue[];
};

/**
 * Runs a route safety check: shows checking-safety bottom sheet with progress, then resolves with safe/unsafe and optional issues.
 * Replace with real routing/safety API when available.
 */
export function useRouteSafetyCheck() {
  const showSheet = useCheckingSafetySheetStore((s) => s.show);
  const setProgress = useCheckingSafetySheetStore((s) => s.setProgress);
  const setMessage = useCheckingSafetySheetStore((s) => s.setMessage);
  const hideSheet = useCheckingSafetySheetStore((s) => s.hide);

  const checkRouteSafety = useCallback(
    (_destination: string): Promise<RouteSafetyResult> => {
      return new Promise((resolve) => {
        showSheet({
          message: 'Checking if route is safe...',
          progress: 0,
        });

        const steps = [
          { at: 400, progress: 20, message: 'Checking if route is safe...' },
          { at: 900, progress: 45, message: 'Analyzing route...' },
          { at: 1400, progress: 70, message: 'Checking safety conditions...' },
          { at: 2000, progress: 95, message: 'Almost done...' },
        ];

        steps.forEach(({ at, progress, message }) => {
          setTimeout(() => {
            setProgress(progress);
            setMessage(message);
          }, at);
        });

        setTimeout(() => {
          const simulateUnsafe = Math.random() < SIMULATE_UNSAFE_CHANCE;
          if (simulateUnsafe) {
            setProgress(100);
            setMessage('Route has safety concerns');
            resolve({ safe: false, issues: MOCK_UNSAFE_ISSUES });
          } else {
            setProgress(100);
            setMessage('Route is safe!');
            resolve({ safe: true });
          }
        }, CHECK_DURATION_MS);
      });
    },
    [showSheet, setProgress, setMessage]
  );

  const hideModal = useCallback(() => hideSheet(), [hideSheet]);

  return { checkRouteSafety, hideModal };
}
