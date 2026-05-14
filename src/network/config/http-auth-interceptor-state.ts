let hardSessionAuthFailure = false;
let refreshInFlight: Promise<boolean> | null = null;
let sessionExpiredSheetShown = false;

export function clearHttpAuthInterceptorState(): void {
  hardSessionAuthFailure = false;
  refreshInFlight = null;
  sessionExpiredSheetShown = false;
}

export function tryMarkSessionExpiredSheetShown(): boolean {
  if (sessionExpiredSheetShown) return false;
  sessionExpiredSheetShown = true;
  return true;
}

export function isHardSessionAuthFailure(): boolean {
  return hardSessionAuthFailure;
}

export function setHardSessionAuthFailure(value: boolean): void {
  hardSessionAuthFailure = value;
}

/**
 * Runs `runner` once for concurrent callers; clears the shared promise when done.
 */
export function runSingleFlightRefresh(
  runner: () => Promise<boolean>
): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = runner().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}
