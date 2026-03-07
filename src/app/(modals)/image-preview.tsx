import { useLocalSearchParams, router } from 'expo-router';
import { ImagePreviewContent } from '@/components/report-management/ImagePreviewContent';
import { useReportDraftStore } from '@/stores/report-draft-store';

/** Placeholder image when no URI is provided – so you can always see the preview UI. */
const MOCK_IMAGE_URI =
  'https://images.unsplash.com/photo-1542601098-3adb0a1b5b62?w=800&q=80';

export type ImagePreviewParams = {
  uri?: string;
  mode: 'media' | 'details';
  index: string;
};

export default function ImagePreviewScreen() {
  const params = useLocalSearchParams<ImagePreviewParams>();
  const rawUri = typeof params.uri === 'string' ? params.uri.trim() : '';
  const uri = rawUri || MOCK_IMAGE_URI;
  const isMock = !rawUri;
  const mode = typeof params.mode === 'string' ? params.mode : 'details';
  const index = typeof params.index === 'string' ? parseInt(params.index, 10) : NaN;

  const setMediaSlotUri = useReportDraftStore((s) => s.setMediaSlotUri);
  const removeMediaUriAt = useReportDraftStore((s) => s.removeMediaUriAt);

  const handleClose = () => router.back();

  const handleDelete = () => {
    if (Number.isNaN(index)) return;
    if (mode === 'media') {
      setMediaSlotUri(index, null);
    } else {
      removeMediaUriAt(index);
    }
    router.back();
  };

  return (
    <ImagePreviewContent
      imageUri={uri}
      isMock={isMock}
      onClose={handleClose}
      onDelete={handleDelete}
      allowDelete
    />
  );
}
