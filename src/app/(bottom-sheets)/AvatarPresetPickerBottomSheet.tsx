import { useCallback } from 'react';
import {
  View,
  Pressable,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppText } from '@/components/ui/AppText';
import { useAppColorScheme } from '@/theme/colorMode';
import { useViewAvailableAvatarPresets } from '@/network/modules/auth/queries';
import type { AvatarPreset } from '@/network/modules/auth/types';
import { dicebearUriToRasterImageUri } from '@/lib/third-party/dicebear';
import { useAvatarPresetPickerStore } from '@/stores/avatar-preset-picker-store';

const SNAP_POINTS = ['72%', '92%'];
const GAP = 12;
const COLUMNS = 3;

function presetKey(p: AvatarPreset, index: number): string {
  return `${p.style}-${p.seed}-${index}`;
}

export default function AvatarPresetPickerBottomSheet() {
  const { theme, isDark } = useAppColorScheme();
  const { width: windowWidth } = useWindowDimensions();
  const close = useAvatarPresetPickerStore((s) => s.close);
  const pick = useAvatarPresetPickerStore((s) => s.pick);
  const isOpen = useAvatarPresetPickerStore((s) => s.isOpen);
  const { data: presets, isPending, isError, refetch } =
    useViewAvailableAvatarPresets();

  const horizontalPadding = 16;
  const contentWidth = windowWidth - horizontalPadding * 2;
  const cell = (contentWidth - GAP * (COLUMNS - 1)) / COLUMNS;

  const handlePick = useCallback(
    (preset: AvatarPreset) => {
      pick(preset);
    },
    [pick]
  );

  return (
    <BaseBottomSheet
      snapPoints={SNAP_POINTS}
      isOpen={isOpen}
      onClose={close}
      title="Choose avatar"
      description="Pick a preset. You can change it anytime in profile settings."
      contentPadding={{ horizontal: horizontalPadding, top: 8, bottom: 16 }}
    >
      {isPending ? (
        <View className="py-16 items-center justify-center">
          <ActivityIndicator color={theme.primaryBlue} />
        </View>
      ) : isError ? (
        <View className="py-8 items-center gap-3">
          <AppText
            variant="body"
            className="text-center text-captionDark dark:text-captionDark-dark"
          >
            Could not load avatars.
          </AppText>
          <Pressable onPress={() => refetch()} accessibilityRole="button">
            <AppText className="font-metropolis-semibold text-primary-blue dark:text-primary-blue-dark">
              Try again
            </AppText>
          </Pressable>
        </View>
      ) : (
        <View
          className="flex-row flex-wrap"
          style={{ gap: GAP, paddingBottom: 8 }}
        >
          {(presets ?? []).map((preset, index) => {
            const uri = dicebearUriToRasterImageUri(preset.preview_url.trim());
            return (
              <Pressable
                key={presetKey(preset, index)}
                onPress={() => handlePick(preset)}
                accessibilityRole="button"
                accessibilityLabel={`Avatar ${preset.style} ${preset.seed}`}
                className="rounded-2xl overflow-hidden border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
                style={{
                  width: cell,
                  height: cell,
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
                }}
              >
                <Image
                  source={{ uri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </BaseBottomSheet>
  );
}
