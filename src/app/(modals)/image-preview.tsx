import { useLocalSearchParams, router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, type ViewToken, useWindowDimensions } from 'react-native';
import { ImagePreviewContent } from '@/components/report-management/ImagePreviewContent';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { getCapturedMedia, removeMedia } from '@/lib/utils/captured-media';
import { showToast } from '@/lib/utils/app-toast';
import { useReportDraftStore } from '@/stores/report-draft-store';

/** Placeholder image when no URI is provided – so you can always see the preview UI. */
const MOCK_IMAGE_URI =
  'https://images.unsplash.com/photo-1542601098-3adb0a1b5b62?w=800&q=80';

export type ImagePreviewParams = {
  uri?: string;
  mode: 'media' | 'details';
  index: string;
  allowDelete?: string;
};

export default function ImagePreviewScreen() {
  const params = useLocalSearchParams<ImagePreviewParams>();
  const rawUri = typeof params.uri === 'string' ? params.uri.trim() : '';
  const uri = rawUri || MOCK_IMAGE_URI;
  const isMock = !rawUri;
  const mode = typeof params.mode === 'string' ? params.mode : 'details';
  const index = typeof params.index === 'string' ? parseInt(params.index, 10) : NaN;
  const allowDelete =
    typeof params.allowDelete === 'string'
      ? params.allowDelete !== 'false'
      : true;

  const mediaSlots = useReportDraftStore((s) => s.mediaSlots);
  const setMediaSlotUri = useReportDraftStore((s) => s.setMediaSlotUri);
  const removeMediaUriAt = useReportDraftStore((s) => s.removeMediaUriAt);
  const { width } = useWindowDimensions();

  const filledSlots = useMemo(
    () =>
      mediaSlots
        .map((slot, i) =>
          slot.uri ? { uri: slot.uri, originalIndex: i } : null
        )
        .filter(Boolean) as { uri: string; originalIndex: number }[],
    [mediaSlots]
  );

  const initialSlotIndex = Number.isNaN(index) ? 0 : index;
  const initialIndexInFilled = filledSlots.findIndex(
    (item) => item.originalIndex === initialSlotIndex
  );
  const safeInitialIndex =
    initialIndexInFilled >= 0 ? initialIndexInFilled : 0;

  const [_currentIndex, setCurrentIndex] = useState(safeInitialIndex);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setCurrentIndex(viewableItems[0].index!);
      }
    }
  ).current;

  const handleClose = usePreventDoublePress(() => router.back());

  const handleDeleteAt = (slotIndex: number) => {
    setMediaSlotUri(slotIndex, null);
    showToast({
      message: 'Media file deleted.',
      variant: 'success',
    });
  };

  // Default single-image preview (used for captured-media previews, etc.)
  const handleDelete = usePreventDoublePress(() => {
    if (Number.isNaN(index)) return;
    if (mode === 'media') {
      handleDeleteAt(index);
    } else {
      // Opened from captured media strip on main screen.
      const item = getCapturedMedia()[index];
      if (item) {
        removeMedia(item.id);
      } else {
        removeMediaUriAt(index);
      }
      showToast({
        message: 'Media deleted.',
        variant: 'success',
      });
    }
  });

  const handleDeleteAtWrapped = usePreventDoublePress((slotIndex: number) => {
    handleDeleteAt(slotIndex);
    handleClose();
  });

  // When opened from the report media step, let users swipe left/right through all media.
  if (mode === 'media' && filledSlots.length > 0) {
    return (
      <FlatList
        data={filledSlots}
        horizontal
        pagingEnabled
        keyExtractor={(item) => `${item.originalIndex}-${item.uri}`}
        initialScrollIndex={safeInitialIndex}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        renderItem={({ item }) => (
          <ImagePreviewContent
            imageUri={item.uri}
            isMock={false}
            onClose={handleClose}
            onDelete={
              allowDelete
                ? () => handleDeleteAtWrapped(item.originalIndex)
                : undefined
            }
            allowDelete={allowDelete}
          />
        )}
      />
    );
  }

  // Fallback single-image preview (details mode or no media slots).
  return (
    <ImagePreviewContent
      imageUri={uri}
      isMock={isMock}
      onClose={handleClose}
      onDelete={handleDelete}
      allowDelete={allowDelete}
    />
  );
}
