import type { QueryClient } from '@tanstack/react-query';
import { WatchMeKeys } from '@/network/modules/watch-me/keys';
import type {
  FetchUserActiveWatchResponse,
  WatchMeSessionForUserWatching,
} from '@/network/modules/watch-me/types';
import type { WebsocketMessage } from '@/stores/websocket-store';

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function pickNumber(o: Record<string, unknown>, key: string): number | null {
  const v = o[key];
  return isNumber(v) ? v : null;
}

function patchSessionLocation(
  session: WatchMeSessionForUserWatching,
  latitude: number,
  longitude: number
): WatchMeSessionForUserWatching {
  return {
    ...session,
    watch_me: {
      ...session.watch_me,
      last_location: {
        latitude,
        longitude,
      },
    },
  };
}

export function applyWatchMeRealtimeMessage(
  queryClient: QueryClient,
  msg: WebsocketMessage
): void {
  if (msg.type !== 'location_update') return;

  // watchme_location / watchme_location_last
  const data = msg.data as Record<string, unknown>;
  const watchMeId = pickNumber(data, 'watch_me_id');
  const lat = pickNumber(data, 'lat');
  const lng = pickNumber(data, 'lng');

  if (watchMeId == null) return;

  // `watchme_location_last` can have has_value=false and omit coords.
  if (lat == null || lng == null) return;

  queryClient.setQueryData<FetchUserActiveWatchResponse | undefined>(
    [WatchMeKeys.FetchUserActiveWatch],
    (old) => {
      if (!old) return old;
      let changed = false;
      const sessions = old.sessions.map((s) => {
        if (s.watch_me.id !== watchMeId) return s;
        changed = true;
        return patchSessionLocation(s, lat, lng);
      });
      if (!changed) return old;
      return { ...old, sessions };
    }
  );
}

