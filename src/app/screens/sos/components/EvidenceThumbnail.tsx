import {TouchableOpacity, Image } from 'react-native';
import { AppAnimatedView } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import SolarTrashBin2BoldDuotoneIcon from '@/components/icons/solar/trash-bin-2-bold-duotone';
import type { SosEvidenceItem } from '@/stores/sos-evidence-store';

export function EvidenceThumbnail({
  item,
  size,
  onRemove,
}: {
  item: SosEvidenceItem;
  size: number;
  onRemove: () => void;
}) {
  if (!item.uri) return null;
  return (
    <AppAnimatedView style={{ width: size, height: size }} className="relative rounded-lg overflow-hidden">
      <Image
        source={{ uri: item.uri }}
        className="w-full h-full bg-[rgba(0,0,0,0.1)]"
        resizeMode="cover"
      />
      {item.type === 'video' && (
        <AppAnimatedView className="absolute inset-0 bg-black/40 items-center justify-center">
          <AppText className="text-white text-[10px] font-metropolis-semibold">
            Video
          </AppText>
        </AppAnimatedView>
      )}
      <TouchableOpacity
        onPress={onRemove}
        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 items-center justify-center"
        accessibilityLabel="Remove"
      >
        <SolarTrashBin2BoldDuotoneIcon width={14} height={14} color="#fff" />
      </TouchableOpacity>
    </AppAnimatedView>
  );
}

export default function _EvidenceThumbnailRoute() {
  return null;
}
