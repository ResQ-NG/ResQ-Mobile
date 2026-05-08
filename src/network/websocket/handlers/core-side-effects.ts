import { router } from 'expo-router';
import type { WebsocketMessage } from '@/stores/websocket-store';
import { useAppToastStore } from '@/stores/app-toast-store';
import { useAuthTokenStore } from '@/stores/auth-token-store';
import { logger } from '@/lib/utils/logger';
import { useTabBadgesStore } from '@/stores/tab-badges-store';

export function runCoreSideEffects(msg: WebsocketMessage): void {
  // Prefer `event` when present; fall back to `type`.
  const eventName = msg.event ?? msg.type;

  if (msg.type === 'error') {
    const m =
      typeof msg.data?.message === 'string'
        ? (msg.data.message as string)
        : 'Something went wrong';
    useAppToastStore.getState().showToast({ message: m, variant: 'error' });
    return;
  }

  switch (eventName) {
    case 'watch_me': {
      // Example:
      // { type: "notification", event: "watch_me", data: { scope: "watch_me", watch_me_id }, ... }
      if (msg.type === 'notification') {
        useTabBadgesStore.getState().markWatchMeUnread();
      }
      return;
    }

    case 'FORCE_LOGOUT': {
      useAuthTokenStore.getState().setToken(null);
      useAppToastStore
        .getState()
        .showToast({ message: 'Signed out.', variant: 'success' });
      // Auth gate will redirect, but we can also force it.
      router.replace('/screens/(onboarding)/welcome');
      return;
    }

    case 'TOAST': {
      const message =
        typeof msg.data?.message === 'string'
          ? (msg.data.message as string)
          : null;
      if (message) {
        useAppToastStore.getState().showToast({ message });
      }
      return;
    }

    default: {
      logger.log('[ws] unhandled event', eventName, msg.data);
    }
  }
}
