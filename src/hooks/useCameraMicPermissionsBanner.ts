import { useEffect, useState } from 'react';
import { useAppBannerStore } from '@/stores/app-banner-store';
import {
  areCameraAndMicAuthorized,
  CAMERA_MIC_BANNER_ID,
  requestCameraAndMicPermissions,
} from '@/lib/permissions';

export function useCameraMicPermissionsBanner() {
  const [hasCameraAndMic, setHasCameraAndMic] = useState(false);
  const showBanner = useAppBannerStore((state) => state.showBanner);
  const hideBanner = useAppBannerStore((state) => state.hideBanner);

  useEffect(() => {
    let cancelled = false;

    const checkPermissions = async () => {
      const authorized = await areCameraAndMicAuthorized();

      if (!cancelled) {
        setHasCameraAndMic(authorized);
      }

      if (!authorized && !cancelled) {
        showBanner({
          id: CAMERA_MIC_BANNER_ID,
          title: 'Camera and mic disabled',
          message: 'ResQ needs camera and microphone to capture evidence.',
          actionLabel: 'Enable',
          onActionPress: async () => {
            const nextAuthorized = await requestCameraAndMicPermissions();

            if (nextAuthorized) {
              setHasCameraAndMic(true);
              hideBanner(CAMERA_MIC_BANNER_ID);
            }
          },
        });
      } else if (authorized) {
        setHasCameraAndMic(true);
        hideBanner(CAMERA_MIC_BANNER_ID);
      }
    };

    void checkPermissions();

    return () => {
      cancelled = true;
      hideBanner(CAMERA_MIC_BANNER_ID);
    };
  }, [showBanner, hideBanner]);

  return { hasCameraAndMic };
}

