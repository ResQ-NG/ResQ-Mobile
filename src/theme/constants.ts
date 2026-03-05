/**
 * Shared UI constants. Use these in AppText, AppAnimatedSafeAreaView, etc.
 */

// --- AppText ---
/** Base (default) is body (primary text). Use caption only for secondary/muted. */
export const DEFAULT_APP_TEXT_VARIANT = 'body' as const;

export const APP_TEXT_VARIANT_STYLES: Record<'body' | 'caption', string> = {
  body: 'text-base font-metropolis-regular text-primaryDark dark:text-primaryDark-dark',
  caption: 'text-sm font-metropolis-regular text-captionDark dark:text-captionDark-dark',
};

// --- Tab bar ---
/** Static height of the tab bar above the device's safe-area inset (paddingTop + icon + paddingBottom). */
export const TAB_BAR_HEIGHT = 84;

// --- Safe area (and general) padding sizes (rem) ---
export type PaddingSize = 'none' | 'sm' | 'md' | 'lg';

export const PADDING_SIZE_CLASSES: Record<PaddingSize, string> = {
  none: '',
  sm: 'p-[1rem]',
  md: 'p-[1.5rem]',
  lg: 'p-[2rem]',
};
