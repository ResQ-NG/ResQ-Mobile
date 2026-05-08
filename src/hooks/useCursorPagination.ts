import { useMemo } from 'react';
import type { CursorPaginatedResult } from '@/network/config/types';

export type UseCursorPaginationResult<T> = {
  items: T[];
  nextCursor: string | undefined;
};

/**
 * Helper for flattening cursor-based `useInfiniteQuery` results into a single list.
 * Useful for infinite scroll (IntersectionObserver / FlatList onEndReached).
 */
export function useCursorPagination<T>(
  pages: CursorPaginatedResult<T>[] | undefined
): UseCursorPaginationResult<T> {
  return useMemo(() => {
    const safePages = pages ?? [];
    const items = safePages.flatMap((p) => p.items ?? []);
    const last = safePages.at(-1);
    const nextCursor = last?.nextCursor;
    return { items, nextCursor };
  }, [pages]);
}

