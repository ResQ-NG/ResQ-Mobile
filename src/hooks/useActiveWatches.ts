import { useMemo } from 'react';
import { useUserLocationStore } from '@/stores/user-location-store';
import { useGetEmergencyContacts } from '@/network/modules/emergency-contacts/queries';
import type {
  ActiveWatch,
  MapCoordinate,
  WatchStatus,
} from '@/components/watchme/types';

/** Offset from the user’s current map center so demo markers don’t stack. */
const OFFSET_PER_INDEX = 0.008;

/** Stable numeric hash from string (for deterministic "random" per contact). */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const STATUSES: WatchStatus[] = ['safe', 'en_route'];
const LAST_OKAY_OPTIONS = [
  'Just now',
  '2 min ago',
  '5 min ago',
  '15 min ago',
  '1 hr ago',
  '2 hrs ago',
  'Earlier today',
];
const DESTINATIONS = [
  'Home',
  'Office',
  'Lekki Phase 1',
  'Victoria Island',
  'Airport',
  '',
];
const DEVICE_INFOS = ['iPhone 15', 'Android', 'iPhone 14', ''];

/**
 * Returns the list of active watches (contacts to show on Watch Me map/overlay).
 * For now status, lastOkayAt, destination, etc. are randomized per contact (stable by id).
 * API can replace this later.
 */
export function useActiveWatches(): ActiveWatch[] {
  const { data: contacts = [] } = useGetEmergencyContacts();
  const baseLng = useUserLocationStore((s) => s.coordinates[0]);
  const baseLat = useUserLocationStore((s) => s.coordinates[1]);

  return useMemo(
    () =>
      contacts.map((c, index) => {
        const seed = hashId(c.id);
        const coordinates: MapCoordinate = [
          baseLng + index * OFFSET_PER_INDEX,
          baseLat + index * OFFSET_PER_INDEX,
        ];
        const status = STATUSES[seed % STATUSES.length];
        const inSosMode = (seed >> 4) % 100 < 18; // ~18% in SOS for variety
        const lastOkayAt = LAST_OKAY_OPTIONS[seed % LAST_OKAY_OPTIONS.length];
        const destination = DESTINATIONS[(seed >> 8) % DESTINATIONS.length];
        const isMoving = (seed >> 12) % 2 === 1;
        const batteryPercent = 70 + ((seed >> 16) % 31);
        const deviceInfo =
          DEVICE_INFOS[(seed >> 20) % DEVICE_INFOS.length] || undefined;
        return {
          id: c.id,
          name: c.name,
          lastCheckLabel: lastOkayAt,
          status,
          inSosMode,
          lastOkayAt,
          destination: destination || undefined,
          isMoving,
          batteryPercent,
          deviceInfo,
          avatarBgIndex: index,
          avatarUrl: c.avatarUrl,
          isAppUser: c.isAppUser,
          availableOnMap: true,
          coordinates,
        };
      }),
    [contacts, baseLng, baseLat]
  );
}
