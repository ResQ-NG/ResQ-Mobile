import { useCallback, useEffect, useRef } from 'react';
import type { ViewToken } from 'react-native';
import { useMarkAsRead } from '@/network/modules/notifications/queries';

type NotificationLike = {
  delivery_id: number;
  read_at?: string;
};



type Options<TItem extends NotificationLike> = {
  items: TItem[];
  /** Maximum number of notifications to mark per flush. Default: 10 */
  batchSize?: number;
  /** Debounce time in ms before flushing. Default: 600 */
  debounceMs?: number;
  /** Viewability config: % visible. Default: 60 */
  itemVisiblePercentThreshold?: number;
  /** Viewability config: minimum time visible. Default: 800 */
  minimumViewTimeMs?: number;
};

export function useNotificationsMarkAsRead<TItem extends NotificationLike>({
  items,
  batchSize = 10,
  debounceMs = 600,
  itemVisiblePercentThreshold = 60,
  minimumViewTimeMs = 800,
}: Options<TItem>) {
  const markAsRead = useMarkAsRead();

  const pendingIdsRef = useRef<Set<string>>(new Set());
  const inFlightIdsRef = useRef<Set<string>>(new Set());
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (markAsRead.isPending) return;
    if (pendingIdsRef.current.size === 0) return;

    const batch: string[] = [];
    for (const id of pendingIdsRef.current) {
      if (batch.length >= batchSize) break;
      pendingIdsRef.current.delete(id);
      if (inFlightIdsRef.current.has(id)) continue;
      inFlightIdsRef.current.add(id);
      batch.push(id);
    }
    if (batch.length === 0) return;

    await Promise.allSettled(
      batch.map(async (deliveryId) => {
        try {
          // Backend expects delivery id for mark-as-read.
          await markAsRead.mutateAsync({ delivery_id: deliveryId });
        } finally {
          inFlightIdsRef.current.delete(deliveryId);
        }
      })
    );
  }, [batchSize, markAsRead]);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) return;
    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      void flush();
    }, debounceMs);
  }, [debounceMs, flush]);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    };
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      for (const v of viewableItems) {
        const item = v.item as TItem | undefined;
        if (!item) continue;
        if (item.read_at) continue;
        if (!Number.isFinite((item as unknown as { delivery_id?: unknown }).delivery_id))
          continue;
        const id = String(item.delivery_id);
        pendingIdsRef.current.add(id);
      }
      scheduleFlush();
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold,
    minimumViewTime: minimumViewTimeMs,
  }).current;

  useEffect(() => {
    for (const it of items) {
      if (!Number.isFinite((it as unknown as { delivery_id?: unknown }).delivery_id))
        continue;
      const id = String(it.delivery_id);
      if (it.read_at) pendingIdsRef.current.delete(id);
    }
  }, [items]);

  return { viewabilityConfig, onViewableItemsChanged, isMarking: markAsRead.isPending };
}
