import { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Share,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import SolarFolderOpenBoldIcon from '@/components/icons/solar/folder-open-bold';
import SolarArchiveMinimalisticBoldIcon from '@/components/icons/solar/archive-minimalistic-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';

export interface ImagePreviewContentProps {
  imageUri: string;
  /** When true, shows a "Mock image" label and disables Download (no-op). */
  isMock?: boolean;
  onClose: () => void;
  onDelete?: () => void;
  allowDelete?: boolean;
}

/** Resolve to a local file URI so we can save/share. Remote URIs are downloaded to cache. */
export async function getLocalUriForPreview(uri: string): Promise<string> {
  if (uri.startsWith('file://')) return uri;
  const filename = uri.split('/').pop()?.split('?')[0] || `image-${Date.now()}.jpg`;
  const cacheDir = FileSystem.cacheDirectory ?? '';
  const localPath = `${cacheDir}preview-${Date.now()}-${filename}`;
  const { uri: localUri } = await FileSystem.downloadAsync(uri, localPath);
  return localUri;
}

export function ImagePreviewContent({
  imageUri,
  isMock = false,
  onClose,
  onDelete,
  allowDelete = true,
}: ImagePreviewContentProps) {
  const { themeName } = useAppColorScheme();
  const { width, height } = useWindowDimensions();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (isMock) return;
    setError(null);
    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to save photos is required.');
        return;
      }
      const localUri = await getLocalUriForPreview(imageUri);
      await MediaLibrary.saveToLibraryAsync(localUri);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (isMock) return;
    setError(null);
    try {
      const localUri = await getLocalUriForPreview(imageUri);
      await Share.share({
        url: localUri,
        message: undefined,
      });
    } catch (e) {
      if ((e as { message?: string })?.message !== 'User did not share') {
        setError(e instanceof Error ? e.message : 'Failed to share');
      }
    }
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  const isDark = themeName === 'dark';
  const bg = isDark ? '#111' : '#fff';
  const textColor = isDark ? '#e5e5e5' : '#1a1a1a';
  const mutedColor = isDark ? '#888' : '#666';

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
      {/* Header: close + title */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'ios' ? 56 : 44,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{ padding: 8 }}
        >
          <SolarArrowLeftBrokenIcon width={24} height={24} color="#fff" />
        </TouchableOpacity>
        <AppText className="text-white font-metropolis-bold" style={{ fontSize: 17 }}>
          Photo
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      {/* Full image */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={{ uri: imageUri }}
          style={{ width, height: height * 0.5 }}
          resizeMode="contain"
        />
        {isMock ? (
          <View
            style={{
              position: 'absolute',
              bottom: 16,
              alignSelf: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <AppText className="text-white text-sm">Mock image</AppText>
          </View>
        ) : null}
      </View>

      {error ? (
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <AppText className="text-red-500 text-center" variant="caption">
            {error}
          </AppText>
        </View>
      ) : null}

      {/* Actions: Download, Delete, Share */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingHorizontal: 24,
          paddingBottom: 32,
          gap: 16,
        }}
      >
        <TouchableOpacity
          onPress={handleDownload}
          disabled={downloading}
          style={{
            flex: 1,
            backgroundColor: bg,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
          }}
        >
          {downloading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <SolarFolderOpenBoldIcon width={22} height={22} color={textColor} />
              <AppText style={{ color: textColor, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
                Download
              </AppText>
            </View>
          )}
        </TouchableOpacity>

        {allowDelete && onDelete ? (
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              flex: 1,
              backgroundColor: bg,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 48,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <SolarArchiveMinimalisticBoldIcon width={22} height={22} color={mutedColor} />
              <AppText style={{ color: mutedColor, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
                Delete
              </AppText>
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={handleShare}
          style={{
            flex: 1,
            backgroundColor: bg,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <SolarUsersGroupRoundedBoldIcon width={22} height={22} color={textColor} />
            <AppText style={{ color: textColor, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
              Share
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
