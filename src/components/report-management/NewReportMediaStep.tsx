import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import SolarArchiveMinimalisticBoldIcon from '@/components/icons/solar/archive-minimalistic-bold';
import SolarTextSquareBoldIcon from '@/components/icons/solar/text-square-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import { RoundedButton } from '../ui';

const IMAGE_GAP = 6;
const IMAGE_STRIP_HEIGHT = 380;
const FOOTER_THUMB_SIZE = 56;

/** Single media slot in the horizontal strip (uri or empty placeholder). */
export interface MediaSlot {
  id: string;
  uri: string | null;
}

interface NewReportMediaStepProps {
  /** Media items shown in the horizontal strip; default two empty slots. */
  mediaSlots?: MediaSlot[];
  /** Called when user taps an empty slot to add/change media. */
  onSlotPress?: (slot: MediaSlot, index: number) => void;
  /** Called when user taps a slot that has an image – open full-screen preview. */
  onPreviewImage?: (uri: string, index: number) => void;
  /** Called when user wants to remove a media slot from the list. */
  onRemoveMedia?: (slot: MediaSlot, index: number) => void;
  /** Thumbnail for footer "add more" (e.g. last added); optional. */
  footerThumbUri?: string | null;
  onAddMorePress?: () => void;
  onAddTextPress?: () => void;
  onNextPress?: () => void;
  /** Bottom inset for footer (safe area). */
  bottomInset?: number;
}

const DEFAULT_SLOTS: MediaSlot[] = [
  { id: '1', uri: null },
  { id: '2', uri: null },
];

export function NewReportMediaStep({
  mediaSlots = DEFAULT_SLOTS,
  onSlotPress,
  onPreviewImage,
  onRemoveMedia,
  footerThumbUri = null,
  onAddMorePress,
  onAddTextPress,
  onNextPress,
  bottomInset = 0,
}: NewReportMediaStepProps) {
  const { theme } = useAppColorScheme();
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.58;
  const paddingH = 16;
  const iconColor = theme.textMuted;

  return (
    <View className="flex-1">
      {/* Tall image strip – horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: paddingH,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        style={{ flexGrow: 0 }}
      >
        {mediaSlots.map((slot, index) => (
          <TouchableOpacity
            key={slot.id}
            onPress={() =>
              onPreviewImage
                ? onPreviewImage(slot.uri ?? '', index)
                : onSlotPress?.(slot, index)
            }
            onLongPress={() => onRemoveMedia?.(slot, index)}
            activeOpacity={0.85}
            className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]"
            style={{
              width: cardWidth,
              height: IMAGE_STRIP_HEIGHT,
              marginRight: index < mediaSlots.length - 1 ? IMAGE_GAP : 0,
            }}
          >
            {slot.uri ? (
              <Image
                source={{ uri: slot.uri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <SolarArchiveMinimalisticBoldIcon
                  width={40}
                  height={40}
                  color={iconColor}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action buttons: T (text) and checkbox */}
      <View className="flex-row justify-center gap-4">
        <RoundedButton
          onPress={onAddTextPress}
          icon={
            <SolarTextSquareBoldIcon width={24} height={24} color={iconColor} />
          }
          className="bg-surface-light dark:bg-surface-dark p-8"
        />

        <RoundedButton
          onPress={onAddTextPress}
          icon={
            <SolarArchiveMinimalisticBoldIcon
              width={24}
              height={24}
              color={iconColor}
            />
          }
          className="bg-surface-light dark:bg-surface-dark p-8"
        />
      </View>

      {/* Footer: thumbnail + Next – spacer so it sits at bottom */}
      <View style={{ flex: 1 }} />
      <View
        className="flex-row items-center justify-between px-4 pb-2"
        style={{ paddingBottom: bottomInset + 12 }}
      >
        <TouchableOpacity
          onPress={onAddMorePress}
          activeOpacity={0.8}
          className="rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]"
          style={{ width: FOOTER_THUMB_SIZE, height: FOOTER_THUMB_SIZE }}
        >
          {footerThumbUri ? (
            <Image
              source={{ uri: footerThumbUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <SolarArchiveMinimalisticBoldIcon
                width={24}
                height={24}
                color={iconColor}
              />
            </View>
          )}
          <View className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary-blue dark:bg-primary-blue-dark items-center justify-center">
            <AppText className="text-white text-xs font-metropolis-bold">
              +
            </AppText>
          </View>
        </TouchableOpacity>

        <AppButton
          onPress={onNextPress}
          variant="primary"
          size="lg"
          className="min-w-[140px]"
        >
          Next
        </AppButton>
      </View>
    </View>
  );
}
