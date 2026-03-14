import { TouchableOpacity } from 'react-native';
import { AppAnimatedView } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarMicrophoneBoldIcon from '@/components/icons/solar/microphone-bold';
import SolarTextSquareBoldIcon from '@/components/icons/solar/text-square-bold';
import SolarTrashBin2BoldDuotoneIcon from '@/components/icons/solar/trash-bin-2-bold-duotone';
import type { SosEvidenceItem } from '@/stores/sos-evidence-store';

export function EvidenceNoteCard({
  item,
  onRemove,
}: {
  item: SosEvidenceItem;
  onRemove: () => void;
}) {
  const { theme } = useAppColorScheme();
  const isVoice = item.type === 'voice';
  return (
    <AppAnimatedView className="flex-row items-center gap-3 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.1)]">
      {isVoice ? (
        <SolarMicrophoneBoldIcon width={20} height={20} color={theme.textMuted} />
      ) : (
        <SolarTextSquareBoldIcon width={20} height={20} color={theme.textMuted} />
      )}
      <AppText
        className="flex-1 text-sm text-primaryDark dark:text-primaryDark-dark"
        numberOfLines={isVoice ? 1 : 3}
      >
        {item.text ?? (isVoice ? 'Voice note' : '')}
      </AppText>
      <TouchableOpacity
        onPress={onRemove}
        className="p-1"
        accessibilityLabel="Remove"
      >
        <SolarTrashBin2BoldDuotoneIcon width={18} height={18} color={theme.textMuted} />
      </TouchableOpacity>
    </AppAnimatedView>
  );
}
