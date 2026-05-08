import type { QueryClient } from '@tanstack/react-query';
import { EmergencyContactsKeys } from '@/network/modules/emergency-contacts/keys';
import type { WebsocketMessage } from '@/stores/websocket-store';

/**
 * Realtime invalidations for emergency contacts.
 *
 * Current use-case: when Watch Me emits a notification (e.g. contact joined),
 * refresh the user's emergency contacts list.
 */
export function applyEmergencyContactsRealtimeMessage(
  queryClient: QueryClient,
  msg: WebsocketMessage
): void {
  if (msg.type !== 'notification' || msg.event !== 'contact_joined') return;
  queryClient.invalidateQueries({ queryKey: [EmergencyContactsKeys.List] });
}
