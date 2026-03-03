import { Easing, Keyframe } from 'react-native-reanimated';

/**
 * Brand animation constants — subtle, consistent motion for ResQ.
 * Use with AppAnimated* entering prop, e.g. entering={brandFadeInUp}.
 * All use ~520ms duration and smooth easing; chain .delay(ms) for stagger.
 */

const DURATION = 520;
const EASE = Easing.out(Easing.cubic);

/** Subtle fade in (opacity 0.7 → 1). */
export const brandFadeIn = new Keyframe({
  from: { opacity: 0.7 },
  to: { opacity: 1, easing: EASE },
}).duration(DURATION);

/** Subtle fade in + small move up (8px). */
export const brandFadeInUp = new Keyframe({
  from: { opacity: 0.7, transform: [{ translateY: 8 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }], easing: EASE },
}).duration(DURATION);

/** Subtle fade in + small move down (8px). */
export const brandFadeInDown = new Keyframe({
  from: { opacity: 0.7, transform: [{ translateY: -8 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }], easing: EASE },
}).duration(DURATION);

/** Very subtle scale in (0.98 → 1) + fade. */
export const brandScaleIn = new Keyframe({
  from: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  to: { opacity: 1, transform: [{ scale: 1 }], easing: EASE },
}).duration(DURATION);
