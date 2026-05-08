import type { QueryClient } from '@tanstack/react-query';
import type { WebsocketMessage } from '@/stores/websocket-store';
import { applyWatchMeRealtimeMessage } from '@/network/modules/watch-me/realtime';
import { applyEmergencyContactsRealtimeMessage } from '@/network/modules/emergency-contacts/realtime';
import { applyNotificationsRealtimeMessage } from '@/network/modules/notifications/realtime';

export type WSRealtimeHandler = (
  queryClient: QueryClient,
  msg: WebsocketMessage
) => void;

/**
 * Register feature-module realtime patchers here.
 * Keep this file focused on registrations so it's easy to see what's plugged in.
 */
const realtimeHandlers: WSRealtimeHandler[] = [
  applyWatchMeRealtimeMessage,
  applyEmergencyContactsRealtimeMessage,
  applyNotificationsRealtimeMessage,
];

export function runRealtimeHandlers(
  queryClient: QueryClient,
  msg: WebsocketMessage
): void {
  for (const h of realtimeHandlers) h(queryClient, msg);
}
