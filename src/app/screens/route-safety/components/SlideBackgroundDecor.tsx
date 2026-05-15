import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppAnimatedView } from '@/lib/animation';
import { brandBgDecorEnter } from '@/lib/brandAnimations';

export type SlideBgIonicon = ComponentProps<typeof Ionicons>['name'];

/** Very subtle fills — background texture only. */
export const SLIDE_BG_FILL = {
  primary: 'rgba(51, 51, 255, 0.06)',
  success: 'rgba(34, 197, 94, 0.05)',
  accent: 'rgba(255, 51, 102, 0.05)',
  muted: 'rgba(255, 255, 255, 0.04)',
} as const;

export type SlideBackgroundDecorTint = keyof typeof SLIDE_BG_FILL;

type SlideBackgroundDecorProps = {
  name: SlideBgIonicon;
  tint?: SlideBackgroundDecorTint;
  size?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export const SLIDE_BG_ICON_SIZE = {
  primary: 180,
  secondary: 164,
} as const;

const DEFAULT_ICON_SIZE = SLIDE_BG_ICON_SIZE.primary;

export function SlideBackgroundDecor({
  name,
  tint = 'primary',
  size = DEFAULT_ICON_SIZE,
  delay = 80,
  style,
}: SlideBackgroundDecorProps) {
  return (
    <AppAnimatedView
      entering={brandBgDecorEnter.delay(delay)}
      style={[{ position: 'absolute' }, style]}
      pointerEvents="none"
    >
      <Ionicons name={name} size={size} color={SLIDE_BG_FILL[tint]} />
    </AppAnimatedView>
  );
}
