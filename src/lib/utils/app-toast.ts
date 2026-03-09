import type { AppToastVariant } from '@/stores/app-toast-store';
import { useAppToastStore } from '@/stores/app-toast-store';

export type ShowToastOptions = {
  message: string;
  variant?: AppToastVariant;
  durationMs?: number;
};

/**
 * Show a toast from anywhere (no hook required). Slides in, then fades out after durationMs.
 */
export function showToast(options: ShowToastOptions): string {
  return useAppToastStore.getState().showToast(options);
}
