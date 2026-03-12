import { useMemo } from 'react';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import type { ActiveWatch } from '@/components/watchme/types';

/**
 * Returns the list of active watches (contacts to show on Watch Me map/overlay).
 * Derived from the user's Watch Me contacts; extra fields (e.g. status, coordinates)
 * can be filled by API later.
 */
export function useActiveWatches(): ActiveWatch[] {
  const contacts = useWatchMeContactsStore((s) => s.contacts);

  return useMemo(
    () =>
      contacts.map((c, index) => ({
        id: c.id,
        name: c.name,
        lastCheckLabel: '—',
        status: 'safe' as const,
        avatarBgIndex: index,
      })),
    [contacts]
  );
}
