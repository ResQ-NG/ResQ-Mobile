/**
 * Brand-aware animation presets for route-safety slides.
 * All use the ResQ brand keyframes so motion is consistent with the rest of the app.
 */
import {
  brandFadeIn,
  brandFadeInUp,
  brandFadeInDown,
  brandScaleIn,
} from '@/lib/brandAnimations';

export { brandFadeIn, brandFadeInUp, brandFadeInDown, brandScaleIn };

/** Header / label text: fades down from above. */
export const slideLabel = brandFadeInDown.delay(60);

/** Primary headline: fades up, slightly later. */
export const slideHeadline = brandFadeInUp.delay(160);

/** Secondary body copy. */
export const slideBody = brandFadeInUp.delay(260);

/** Card: staggered scale-in, pass index for offset. */
export function slideCard(index: number) {
  return brandScaleIn.delay(180 + index * 90);
}

/** Stat row: staggered fade-up, pass index for offset. */
export function statRow(index: number) {
  return brandFadeInUp.delay(200 + index * 100);
}

/** CTA button at slide bottom. */
export const slideCta = brandFadeInUp.delay(700);
