import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { useAppBannerStore } from '@/stores/app-banner-store';
import { useSosActiveStore } from '@/stores/sos-active-store';
import { useInCallStore } from '@/stores/in-call-store';
import { useInChatStore } from '@/stores/in-chat-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

export const SOS_ACTIVE_BANNER_ID = 'sos-active';

/**
 * Shows a non-dismissable SOS banner when SOS is active so the user can always
 * see that SOS is on and tap to continue back to the SOS screen.
 * Banner is hidden when the user is on the SOS screen, camera (main / SOS evidence), in-call, or chat screen.
 */
export function useSosBanner() {
  const pathname = usePathname();
  const isSosActive = useSosActiveStore((s) => s.isActive);
  const isInCallScreenOpen = useInCallStore(
    (s) => s.isActive && s.isModalExpanded
  );
  const isChatScreenOpen = useInChatStore(
    (s) => s.agencyNames.length > 0 && s.isScreenExpanded
  );
  const showBanner = useAppBannerStore((s) => s.showBanner);
  const hideBanner = useAppBannerStore((s) => s.hideBanner);
  const hideBannerOnScreen =
    pathname === '/screens/sos' ||
    pathname === '/screens/sos/evidence' ||
    pathname === '/screens/main' ||
    pathname.includes('in-call') ||
    pathname.includes('chat') ||
    isInCallScreenOpen ||
    isChatScreenOpen;
  const goToSos = usePreventDoublePress(() => router.push('/screens/sos'));

  useEffect(() => {
    if (!isSosActive || hideBannerOnScreen) {
      hideBanner(SOS_ACTIVE_BANNER_ID);
      return;
    }

    showBanner({
      id: SOS_ACTIVE_BANNER_ID,
      title: 'SOS active',
      message: 'Your location is being shared. Tap to return to SOS.',
      actionLabel: 'Continue',
      onActionPress: goToSos,
      dismissable: false,
      actionDismissesBanner: false,
      variant: 'danger',
    });
  }, [isSosActive, hideBannerOnScreen, showBanner, hideBanner, goToSos]);
}
