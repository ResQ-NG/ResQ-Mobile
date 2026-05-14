import { Pressable, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { AppThemeTokens } from '@/theme/colorMode';

export function GetStartedRememberMeRow({
  value,
  onValueChange,
  theme,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
  theme: AppThemeTokens;
}) {
  const { fontScale } = useWindowDimensions();
  /** Outer ring ~1.2× body (16px) text size so it tracks system font scaling. */
  const outerPx = Math.max(18, Math.round(16 * fontScale * 1.2));
  const innerPx = Math.max(6, Math.round(outerPx * 0.42));
  const borderW = outerPx >= 22 ? 2 : 1.5;
  const ringTopPad = Math.max(0, Math.round((20 * fontScale - outerPx) / 2));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Remember me on this device"
      className="flex-row items-start gap-3 rounded-xl py-2 active:opacity-80"
    >
      <View
        className="shrink-0 items-center justify-center"
        style={{ paddingTop: ringTopPad }}
      >
        <View
          style={{
            width: outerPx,
            height: outerPx,
            borderRadius: outerPx / 2,
            borderWidth: borderW,
            borderColor: value ? theme.primaryBlue : theme.textMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {value ? (
            <View
              style={{
                width: innerPx,
                height: innerPx,
                borderRadius: innerPx / 2,
                backgroundColor: theme.primaryBlue,
              }}
            />
          ) : null}
        </View>
      </View>
      <View className="min-w-0 flex-1">
        <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark text-base">
          Remember me
        </AppText>
        <AppText
          variant="caption"
          className="text-captionDark dark:text-captionDark-dark mt-1"
        >
          Stay signed in on this device. If this is off, you will need to sign
          in again when your session ends.
        </AppText>
      </View>
    </Pressable>
  );
}
