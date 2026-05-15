import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTE_SAFETY_PAGER_FOOTER_CHROME } from '../routeSafetyScreenConstants';

/** Overlaid close + progress dots row (below status bar). */
export const PAGER_TOP_CHROME = 56;

/** Overlaid Next + Skip buttons + spacing (above home indicator). */
export const PAGER_BOTTOM_CHROME = ROUTE_SAFETY_PAGER_FOOTER_CHROME;

/** Last slide: no Next overlay — only safe-area breathing room. */
export const PAGER_BOTTOM_CHROME_LAST = 20;

type PagerSlideInsetOptions = {
  /** Final slide with in-content CTA instead of pager Next. */
  lastSlide?: boolean;
};

export function usePagerSlideInsets(options?: PagerSlideInsetOptions) {
  const insets = useSafeAreaInsets();
  const bottomChrome = options?.lastSlide
    ? PAGER_BOTTOM_CHROME_LAST
    : PAGER_BOTTOM_CHROME;

  return {
    insets,
    paddingTop: insets.top + PAGER_TOP_CHROME,
    paddingBottom: insets.bottom + bottomChrome,
    topChrome: PAGER_TOP_CHROME,
    bottomChrome,
  };
}

type PagerSlideContentProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  lastSlide?: boolean;
};

/** Insets slide body below pager chrome (close, dots, Next). */
export function PagerSlideContent({
  children,
  className,
  style,
  lastSlide,
}: PagerSlideContentProps) {
  const { paddingTop, paddingBottom } = usePagerSlideInsets({ lastSlide });

  return (
    <View
      className={className}
      style={[{ flex: 1, paddingTop, paddingBottom }, style]}
    >
      {children}
    </View>
  );
}
