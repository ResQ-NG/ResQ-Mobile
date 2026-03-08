import type { OnboardingFeature } from './OnboardingFeatureRow';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import SolarShieldCheckBoldIcon from '@/components/icons/solar/shield-check-bold';

/** Step 1: Why it matters */
export const WATCH_ME_STEP_1_FEATURES: OnboardingFeature[] = [
  {
    Icon: SolarMapPointBoldIcon,
    title: 'Live location sharing',
    description:
      'Chosen contacts see where you are until you arrive safely. If something goes wrong, they can get help faster.',
  },
  {
    Icon: SolarUsersGroupRoundedBoldIcon,
    title: 'Peace of mind',
    description:
      'Perfect for late-night trips, unfamiliar areas, or whenever you want loved ones in the loop.',
  },
];

/** Step 2: How to get started */
export const WATCH_ME_STEP_2_FEATURES: OnboardingFeature[] = [
  {
    Icon: SolarUsersGroupRoundedBoldIcon,
    title: 'Setup your contacts',
    description:
      'Add and group trusted contacts (e.g. family, work). You’ll choose who watches when you start a session.',
  },
  {
    Icon: SolarMapPointBoldIcon,
    title: 'Pick your destination',
    description: 'Enter where you’re going and your estimated arrival.',
  },
  {
    Icon: SolarShieldCheckBoldIcon,
    title: 'They follow along — you stay safer',
    description:
      'Your contacts see your live location until you arrive. If you need help, they know where you are.',
  },
];
