import { useCallback, useRef } from 'react';

const DEFAULT_DELAY_MS = 450;

/**
 * Returns a callback that ignores invocations within a short time window.
 * Use for onPress handlers (TouchableOpacity, Pressable, etc.) to prevent
 * double navigation or double actions when the user taps too fast.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accept any function signature for press handlers
export function usePreventDoublePress<T extends (...args: any[]) => void>(
  callback: T,
  options?: { delayMs?: number }
): T {
  const delayMs = options?.delayMs ?? DEFAULT_DELAY_MS;
  const lastPressRef = useRef(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastPressRef.current < delayMs) return;
      lastPressRef.current = now;
      callback(...args);
    }) as T,
    [callback, delayMs]
  );
}
