import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAppBannerStore } from '@/stores/app-banner-store';
import {
  isMediaLibraryAuthorized,
  MEDIA_LIBRARY_BANNER_ID,
  requestMediaLibraryPermission,
} from '@/lib/permissions';

type UseMediaLibraryPermissionsBannerResult = {
  openImagePickerWithPermissions: (options?: {
    selectionLimit?: number;
  }) => Promise<ImagePicker.ImagePickerAsset[] | null>;
};

export function useMediaLibraryPermissionsBanner(): UseMediaLibraryPermissionsBannerResult {
  const showBanner = useAppBannerStore((state) => state.showBanner);
  const hideBanner = useAppBannerStore((state) => state.hideBanner);

  const openImagePickerWithPermissions = useCallback(
    async (options?: { selectionLimit?: number }) => {
      const selectionLimit = options?.selectionLimit ?? 30;

      const authorized = await isMediaLibraryAuthorized();
      if (!authorized) {
        return new Promise<ImagePicker.ImagePickerAsset[] | null>((resolve) => {
          showBanner({
            id: MEDIA_LIBRARY_BANNER_ID,
            title: 'Photos access disabled',
            message:
              'ResQ needs access to your photos to add existing evidence.',
            actionLabel: 'Enable',
            onActionPress: async () => {
              const nextGranted = await requestMediaLibraryPermission();
              if (nextGranted) {
                hideBanner(MEDIA_LIBRARY_BANNER_ID);
                try {
                  const pickerResult =
                    await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ['images', 'videos', 'livePhotos'],
                      allowsMultipleSelection: true,
                      quality: 1,
                      selectionLimit,
                    });

                  if (pickerResult.canceled) {
                    resolve(null);
                  } else {
                    resolve(pickerResult.assets);
                  }
                } catch {
                  resolve(null);
                }
              } else {
                resolve(null);
              }
            },
          });
        });
      }

      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos', 'livePhotos'],
          allowsMultipleSelection: true,
          quality: 1,
          selectionLimit,
        });

        if (result.canceled) return null;
        return result.assets;
      } catch {
        return null;
      }
    },
    [showBanner, hideBanner]
  );

  return { openImagePickerWithPermissions };
}
