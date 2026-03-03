import type { OnboardingFeature } from './OnboardingFeatureRow';
import SolarCameraBoldIcon from '@/components/icons/solar/camera-bold';
import SolarEyeBoldIcon from '@/components/icons/solar/eye-bold';
import UsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import ShieldCheckBoldIcon from '@/components/icons/solar/shield-check-bold';

export const STEP_1_FEATURES: OnboardingFeature[] = [
  {
    Icon: SolarCameraBoldIcon,
    title: 'Report crimes instantly',
    description:
      'Open the app and start capturing evidence immediately. Every second counts.',
  },
  {
    Icon: SolarEyeBoldIcon,
    title: 'Stay safe with watch me',
    description:
      "Share your location in real-time with trusted contacts. They'll know if something goes wrong.",
  },
];

export const STEP_2_FEATURES: OnboardingFeature[] = [
  {
    Icon: UsersGroupRoundedBoldIcon,
    title: 'Join your community',
    description:
      'Stay informed about safety in your area. Help others and get help when you need it.',
  },
  {
    Icon: ShieldCheckBoldIcon,
    title: 'Your evidence is protected',
    description:
      "Everything you capture is encrypted and timestamped. It can't be altered or deleted.",
  },
];
