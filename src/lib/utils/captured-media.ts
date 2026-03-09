import { useCapturedMediaStore } from '@/stores/captured-media-store';

export type { CapturedMediaItem } from '@/stores/captured-media-store';

/**
 * Add a media item (e.g. photo or gallery URI) to the captured media list.
 * Use from any module without a React hook.
 */
export function addMedia(uri: string): void {
  useCapturedMediaStore.getState().addMedia(uri);
}

/**
 * Remove a media item by id from the captured media list.
 * Use from any module without a React hook.
 */
export function removeMedia(id: string): void {
  useCapturedMediaStore.getState().removeMedia(id);
}

/**
 * Clear all captured media.
 * Use from any module without a React hook.
 */
export function clearCapturedMedia(): void {
  useCapturedMediaStore.getState().clear();
}

/**
 * Get the current list of captured media items.
 * Use from any module without a React hook.
 */
export function getCapturedMedia() {
  return useCapturedMediaStore.getState().items;
}
