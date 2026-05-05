import { isPlainRecord } from '@/network/config/type-guards';

export type ApiFieldErrorItem = {
  field: string;
  message: string;
};

function parseFieldErrorArray(data: unknown): ApiFieldErrorItem[] {
  if (!Array.isArray(data)) return [];
  const out: ApiFieldErrorItem[] = [];
  for (const item of data) {
    if (!isPlainRecord(item)) continue;
    const field = item.field;
    const message = item.message;
    if (typeof field !== 'string' || typeof message !== 'string') continue;
    out.push({ field, message });
  }
  return out;
}

/**
 * Parses `{ field, message }[]` from API error payloads attached to failures.
 * Supports `payload.data`, or nested `payload.error.data` as used by ResQ HTTP 400.
 */
export function extractApiFieldErrorsFromFailureError(
  failureError: unknown
): ApiFieldErrorItem[] {
  if (!isPlainRecord(failureError)) return [];

  const direct = parseFieldErrorArray(failureError.data);
  if (direct.length > 0) return direct;

  const nested = failureError.error;
  if (isPlainRecord(nested)) {
    const fromNested = parseFieldErrorArray(nested.data);
    if (fromNested.length > 0) return fromNested;
  }

  return [];
}

/** Multiple messages for one field append with newline. */
export function fieldErrorsToPartialRecord(
  items: ApiFieldErrorItem[]
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const { field, message } of items) {
    if (map[field]) map[field] = `${map[field]}\n${message}`;
    else map[field] = message;
  }
  return map;
}

/** Short user-facing string for toasts when inline errors are not used. */
export function formatFieldErrorsForToast(
  failureError: unknown,
  opts?: { maxLen?: number }
): string | null {
  const items = extractApiFieldErrorsFromFailureError(failureError);
  if (items.length === 0) return null;
  const s = items.map((i) => i.message).join(' ');
  const maxLen = opts?.maxLen ?? 320;
  if (s.length <= maxLen) return s;
  return `${s.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
}

/** Thrown mutation error is usually ApiError — extract `original.error`. */
export function extractApiFieldErrorsFromThrown(
  error: unknown
): ApiFieldErrorItem[] {
  if (!error || typeof error !== 'object') return [];
  const orig = (error as { original?: unknown }).original;
  if (!isPlainRecord(orig) || orig.success !== false) return [];
  return extractApiFieldErrorsFromFailureError(orig.error);
}
