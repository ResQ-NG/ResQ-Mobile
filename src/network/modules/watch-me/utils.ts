import type { ActiveWatch, WatchStatus } from '@/components/watchme/types';
import type { WatchMeSessionForUserWatching } from './types';

function formatRelativeSignal(iso: string | undefined): string {
  if (!iso?.trim()) return '—';
  const d = new Date(iso.trim());
  if (Number.isNaN(d.getTime())) return '—';
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return 'Just now';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  return d.toLocaleDateString();
}


//TODO: would eventually get this info from WS 
function mapApiWatchStatus(status: string | undefined): WatchStatus {
  const s = (status ?? '').toLowerCase();
  if (
    s.includes('route') ||
    s.includes('transit') ||
    s.includes('travel') ||
    s.includes('en_route')
  ) {
    return 'en_route';
  }
  return 'safe';
}

/** Stable key for list selection / modal routing (no session id from API yet). */
export function watchMeSessionStableId(
  session: WatchMeSessionForUserWatching,
  index: number
): string {
  const email = session.contact.email?.trim();
  const phone = session.contact.phone_number?.trim();
  if (email) return `wm:${email}:${index}`;
  if (phone) return `wm:${phone}:${index}`;
  return `wm:${index}`;
}

export function mapWatchMeSessionsToActiveWatches(
  sessions: WatchMeSessionForUserWatching[]
): ActiveWatch[] {
  return sessions.map((session, index) => {
    const id = watchMeSessionStableId(session, index);
    const name =
      session.contact.full_name?.trim() ||
      session.contact.email?.trim() ||
      session.contact.phone_number?.trim() ||
      'Traveler';

    const lat = session.watch_me.last_location?.latitude;
    const lng = session.watch_me.last_location?.longitude;
    const hasCoords =
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng);

    const avatarUrl = session.traveler.avatar_url?.trim() || undefined;
    const transport = session.watch_me.transport_mode_name?.trim();

    return {
      id,
      name,
      lastCheckLabel: formatRelativeSignal(session.watch_me.last_signal_at),
      status: mapApiWatchStatus(session.watch_me.status),
      avatarBgIndex: index % 8,
      avatarUrl: avatarUrl || undefined,
      isAppUser: true,
      lastOkayAt: formatRelativeSignal(session.watch_me.last_signal_at),
      destination: undefined,
      isMoving: undefined,
      batteryPercent: undefined,
      deviceInfo: transport ? transport : undefined,
      inSosMode: false,
      availableOnMap: hasCoords,
      coordinates: hasCoords ? [lng, lat] : undefined,
    };
  });
}
