import { useEffect, useRef } from 'react';
import { useAppBannerStore } from '@/stores/app-banner-store';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';

export const WATCH_ME_SESSION_BANNER_ID = 'watch-me-session';

/**
 * Shows the app banner when a Watch Me session is active.
 * Banner is dismissable (user can close it); session stays active until they end it elsewhere.
 * Only shows once per session start (does not re-show after dismiss until session restarts).
 */
export function useWatchMeSessionBanner() {
  const isSessionActive = useWatchMeContactsStore((s) => s.isSessionActive);
  const showBanner = useAppBannerStore((s) => s.showBanner);
  const hideBanner = useAppBannerStore((s) => s.hideBanner);
  const hasShownThisSession = useRef(false);

  useEffect(() => {
    if (!isSessionActive) {
      hasShownThisSession.current = false;
      hideBanner(WATCH_ME_SESSION_BANNER_ID);
      return;
    }

    if (hasShownThisSession.current) return;

    hasShownThisSession.current = true;
    showBanner({
      id: WATCH_ME_SESSION_BANNER_ID,
      title: 'Watch Me is active',
      message: 'Your contacts can see your location. Tap to view or end the session.',
      dismissable: true,
    });
  }, [isSessionActive, showBanner, hideBanner]);
}
