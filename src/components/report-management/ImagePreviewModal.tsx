import { Modal } from 'react-native';
import { ImagePreviewContent } from './ImagePreviewContent';

export interface ImagePreviewModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onDelete?: () => void;
  allowDelete?: boolean;
}

/** Overlay modal wrapper for image preview. Prefer navigating to (modals)/image-preview for report flow. */
export function ImagePreviewModal({
  visible,
  imageUri,
  onClose,
  onDelete,
  allowDelete = true,
}: ImagePreviewModalProps) {
  if (!visible || !imageUri) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <ImagePreviewContent
        imageUri={imageUri}
        onClose={onClose}
        onDelete={onDelete}
        allowDelete={allowDelete && !!onDelete}
      />
    </Modal>
  );
}
