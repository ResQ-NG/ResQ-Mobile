import type { QueryClient } from '@tanstack/react-query';
import type { WebsocketMessage } from '@/stores/websocket-store';
import { NotificationsKeys } from '@/network/modules/notifications/keys';
import { useTabBadgesStore } from '@/stores/tab-badges-store';

export function applyNotificationsRealtimeMessage(
  queryClient: QueryClient,
  msg: WebsocketMessage
): void {
  if (msg.type !== 'notification') return;

  // Global unread indicator for any incoming notifications.
  useTabBadgesStore.getState().addUnreadBadgeToNotifications();

  // Keep list fresh when new notifications arrive.
  queryClient.invalidateQueries({ queryKey: [NotificationsKeys.List] });
}
