import { useMemo } from 'react';
import { useGetEmergencyContacts } from '@/network/modules/emergency-contacts/queries';
import type { WatchMeContactGroup } from '@/components/watchme/WatchMeContactSection';
import type { WatchMeContact } from '@/components/watchme/WatchMeContactCard';
import {
  formatEmergencyContactReachabilityLine,
  type UiEmergencyContact,
} from '@/network/modules/emergency-contacts/utils';
import { avatarRemoteSource } from '@/components/ui/Avatar';

const OTHER_GROUP_ID = 'relationship-other';
const OTHER_GROUP_NAME = 'Other contacts';

function groupKeyForContact(c: UiEmergencyContact): string {
  if (c.relationshipId != null) {
    return `relationship-${c.relationshipId}`;
  }
  const label = c.relationshipLabel?.trim();
  if (label) {
    return `relationship-label-${label}`;
  }
  return OTHER_GROUP_ID;
}

function groupTitleForContact(c: UiEmergencyContact): string {
  const label = c.relationshipLabel?.trim();
  if (label) return label;
  return OTHER_GROUP_NAME;
}

/**
 * Returns contact groups for the Start Watch Me step.
 * Groups emergency contacts by relationship; contacts without one go under "Other contacts".
 */
export function useWatchMeContactGroups(): WatchMeContactGroup[] {
  const { data: contacts = [] } = useGetEmergencyContacts();

  return useMemo(() => {
    if (contacts.length === 0) return [];

    type Bucket = { title: string; items: WatchMeContact[] };
    const buckets = new Map<string, Bucket>();

    contacts.forEach((c, index) => {
      const key = groupKeyForContact(c);
      const title = groupTitleForContact(c);
      const watchContact: WatchMeContact = {
        id: c.id,
        name: c.name,
        maskedPhone: formatEmergencyContactReachabilityLine(c),
        avatarSource: avatarRemoteSource(c.avatarUrl) ?? null,
        avatarBgIndex: index,
        isAppUser: c.isAppUser,
      };

      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = { title, items: [] };
        buckets.set(key, bucket);
      }
      bucket.items.push(watchContact);
    });

    const groups: WatchMeContactGroup[] = [...buckets.entries()].map(
      ([id, { title, items }]) => ({
        id,
        name: title,
        contacts: items,
      })
    );

    groups.sort((a, b) => {
      if (a.id === OTHER_GROUP_ID) return 1;
      if (b.id === OTHER_GROUP_ID) return -1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });

    return groups;
  }, [contacts]);
}
