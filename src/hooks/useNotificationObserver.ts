import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

/**
 * Listens for notification taps and deep-links when the payload includes
 * a `url` in data (e.g. { data: { url: "/screens/check-safety" } }).
 */
export function useNotificationObserver() {
  useEffect(() => {
    const last = Notifications.getLastNotificationResponse();
    if (last?.notification) {
      const url = last.notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push(url as Parameters<typeof router.push>[0]);
      }
    }

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;
        if (typeof url === 'string') {
          router.push(url as Parameters<typeof router.push>[0]);
        }
      }
    );
    return () => sub.remove();
  }, []);
}
