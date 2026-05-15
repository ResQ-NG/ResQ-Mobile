import { Dimensions } from 'react-native';

const window = Dimensions.get('window');

export const ROUTE_SAFETY_SCREEN_WIDTH = window.width;
export const ROUTE_SAFETY_SCREEN_HEIGHT = window.height;

export const ROUTE_SAFETY_SLIDE_PAGE_STYLE = {
  width: ROUTE_SAFETY_SCREEN_WIDTH,
  height: ROUTE_SAFETY_SCREEN_HEIGHT,
} as const;

/** Horizontal pager slide indices (order matches FlatList data). */
export const ROUTE_SAFETY_SLIDE = {
  ROUTES_FOUND: 0,
  ROUTE_CARDS: 1,
  ANALYTICS: 2,
  MEDIA: 3,
  DESTINATION_CHECK: 4,
  RECOMMENDATION: 5,
} as const;

export const ROUTE_SAFETY_SLIDE_COUNT = Object.keys(ROUTE_SAFETY_SLIDE).length;

export const ROUTE_SAFETY_LAST_SLIDE_INDEX = ROUTE_SAFETY_SLIDE_COUNT - 1;

/** Mock analysis delay before showing the results pager (ms). */
export const ROUTE_ANALYSIS_MOCK_DELAY_MS = 1200;

/** FlatList scroll event throttle (ms). */
export const ROUTE_SAFETY_PAGER_SCROLL_THROTTLE_MS = 16;

/** Pager overlay chrome (close row) — below device safe area. */
export const ROUTE_SAFETY_PAGER_OVERLAY = {
  topInset: 8,
  horizontalPadding: 20,
  rowGap: 16,
  closeButtonBg: 'rgba(0,0,0,0.4)',
  footerBottomInset: 24,
  footerButtonGap: 10,
} as const;

export const ROUTE_SAFETY_PAGER_ICONS = {
  closeSize: 20,
} as const;

export const ROUTE_SAFETY_TOUCH = {
  activeOpacity: 0.7,
} as const;

/** Full-width Next + Skip buttons on dark pager (for slide content padding). */
export const ROUTE_SAFETY_PAGER_FOOTER_CHROME = 132;

export const ROUTE_SAFETY_INPUT_PHASE = {
  footerBottomInset: 0,
  inputIconSize: 18,
  calloutIconSize: 22,
} as const;

export const ROUTE_SAFETY_PAGER_COLORS = {
  background: '#000',
  iconOnDark: '#fff',
} as const;

export const ROUTE_ANALYTICS_SLIDESHOW = {
  height: 168,
  intervalMs: 4500,
  horizontalPadding: 20,
} as const;
