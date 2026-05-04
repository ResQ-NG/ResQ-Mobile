import { useState } from 'react';
import {
  View,
  Image,
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
import { RoundedButton } from '@/components/ui';
import SolarDownloadBoldIcon from '../icons/solar/download-bold';
import SolarShareBoldIcon from '../icons/solar/share-bold';
import SolarTrashBin2BoldDuotoneIcon from '../icons/solar/trash-bin-2-bold-duotone';

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
  const { isDark } = useAppColorScheme();
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

  const textColor = isDark ? '#e5e5e5' : '#1a1a1a';

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header: close + title – styled like overlay controls */}
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
        <RoundedButton
          onPress={onClose}
          icon={<SolarArrowLeftBrokenIcon width={20} height={20} color="#fff" />}
          className="bg-[rgba(0,0,0,0.85)] border border-[rgba(255,255,255,0.18)]"
        />
        <AppText
          className="text-white font-metropolis-semibold"
          style={{ fontSize: 16 }}
        >
          Photo
        </AppText>
        <View style={{ width: 44, height: 44 }} />
      </View>

      {/* Full image, centered like camera view */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: width * 0.9,
            height: height * 0.6,
            borderRadius: 24,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
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

      {/* Actions: Download, Delete, Share – styled like overlay buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 24,
          paddingHorizontal: 24,
          paddingBottom: 32,
        }}
      >
        <View style={{ alignItems: 'center', gap: 6 }}>
          <RoundedButton
            onPress={handleDownload}
            disabled={downloading}
            icon={
              downloading ? (
                <ActivityIndicator size="small" color={textColor} />
              ) : (
                <SolarDownloadBoldIcon width={20} height={20} color={textColor} />
              )
            }
            className="bg-[rgba(0,0,0,0.85)] border border-[rgba(255,255,255,0.16)]"
          />
          <AppText
            className="text-white/90 text-xs font-metropolis-medium"
            style={{ marginTop: 0 }}
          >
            Download
          </AppText>
        </View>

        {allowDelete && onDelete ? (
          <View style={{ alignItems: 'center', gap: 6 }}>
            <RoundedButton
              onPress={handleDelete}
              icon={
                <SolarTrashBin2BoldDuotoneIcon
                  width={20}
                  height={20}
                  color={textColor}
                />
              }
              className="bg-[rgba(0,0,0,0.85)] border border-[rgba(255,255,255,0.16)]"
            />
            <AppText
              className="text-white/90 text-xs font-metropolis-medium"
              style={{ marginTop: 0 }}
            >
              Delete
            </AppText>
          </View>
        ) : null}

        <View style={{ alignItems: 'center', gap: 6 }}>
          <RoundedButton
            onPress={handleShare}
            icon={
              <SolarShareBoldIcon
                width={20}
                height={20}
                color={textColor}
              />
            }
            className="bg-[rgba(0,0,0,0.85)] border border-[rgba(255,255,255,0.16)]"
          />
          <AppText
            className="text-white/90 text-xs font-metropolis-medium"
            style={{ marginTop: 0 }}
          >
            Share
          </AppText>
        </View>
      </View>
    </View>
  );
}
