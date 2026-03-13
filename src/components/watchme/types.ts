export type WatchStatus = 'safe' | 'en_route';

/** [longitude, latitude] for map display */
export type MapCoordinate = [number, number];

export type ActiveWatch = {
  id: string;
  name: string;
  lastCheckLabel: string;
  status: WatchStatus;
  avatarBgIndex?: number;
  destination?: string;
  lastOkayAt?: string;
  isMoving?: boolean;
  batteryPercent?: number;
  deviceInfo?: string;
  /** When true, contact is in SOS mode (overrides status for badge) */
  inSosMode?: boolean;
  /** When true, this contact's Watch Me is visible on the map */
  availableOnMap?: boolean;
  /** Location used for map marker and focus (required when availableOnMap is true) */
  coordinates?: MapCoordinate;
};

export function getStatusBadgeBg(status: WatchStatus): string {
  return status === 'safe' ? '#16A34A' : '#F59E0B';
}

export function getStatusBadgeLabel(status: WatchStatus): string {
  return status === 'safe' ? 'Safe' : 'On route';
}

export function getWatchBadgeBg(watch: ActiveWatch): string {
  return watch.inSosMode ? '#DC2626' : getStatusBadgeBg(watch.status);
}

export function getWatchBadgeLabel(watch: ActiveWatch): string {
  return watch.inSosMode ? 'SOS' : getStatusBadgeLabel(watch.status);
}
