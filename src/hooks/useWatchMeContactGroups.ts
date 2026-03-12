import { useMemo } from 'react';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import type { WatchMeContactGroup } from '@/components/watchme/WatchMeContactSection';
import type { WatchMeContact } from '@/components/watchme/WatchMeContactCard';

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '****';
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}

/**
 * Returns contact groups for the Start Watch Me step.
 * Uses the user's Watch Me contacts from the store; single group "Your contacts".
 */
export function useWatchMeContactGroups(): WatchMeContactGroup[] {
  const contacts = useWatchMeContactsStore((s) => s.contacts);

  return useMemo(() => {
    if (contacts.length === 0) return [];

    const watchMeContacts: WatchMeContact[] = contacts.map((c, index) => ({
      id: c.id,
      name: c.name,
      maskedPhone: maskPhone(c.phone),
      avatarBgIndex: index,
    }));

    return [
      {
        id: 'your-contacts',
        name: 'Your contacts',
        contacts: watchMeContacts,
      },
    ];
  }, [contacts]);
}
