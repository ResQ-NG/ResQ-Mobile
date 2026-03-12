export type WatchStatus = 'safe' | 'en_route' | 'overdue';

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
  /** When true, this contact's Watch Me is visible on the map; list shows "On map" and tap focuses map on them */
  availableOnMap?: boolean;
  /** Location used for map marker and focus (required when availableOnMap is true) */
  coordinates?: MapCoordinate;
};

export function getStatusBadgeBg(status: WatchStatus): string {
  return status === 'safe' ? '#16A34A' : status === 'overdue' ? '#DC2626' : '#F59E0B';
}

export function getStatusBadgeLabel(status: WatchStatus): string {
  return status === 'safe' ? 'Safe' : status === 'en_route' ? 'On route' : 'Overdue';
}
