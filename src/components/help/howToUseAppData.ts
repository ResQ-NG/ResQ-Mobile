import type { ComponentType } from 'react';
import type { OnboardingFeature } from '@/components/onboarding';
import SolarCameraBoldIcon from '@/components/icons/solar/camera-bold';
import SolarGalleryAddBoldIcon from '@/components/icons/solar/gallery-add-bold';
import SolarWalkingBoldIcon from '@/components/icons/solar/walking-bold';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarSirenRoundedBoldIcon from '@/components/icons/solar/siren-rounded-bold';
import SolarPhoneCallingRoundedBoldIcon from '@/components/icons/solar/phone-calling-rounded-bold';
import SolarSpeakerBoldIcon from '@/components/icons/solar/speaker-bold';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';

/** Soft “watch more” links — swap `url` for your own YouTube/Vimeo/help-site IDs when ready. */
export type HowToUseVideoLink = {
  label: string;
  url: string;
};

/** Opens YouTube search for a topic; replace with direct `watch?v=` links for curated clips. */
function topicVideoSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export type HowToUseSlideStat = {
  value: string;
  label: string;
};

export type HowToUseStep = {
  /** Short label for the progress dots */
  label: string;
  title: string;
  subtitle: string;
  /** Hero illustration + headline stats at the top of the slide */
  hero: {
    Icon: ComponentType<{ width: number; height: number; color: string }>;
    gradientLight: readonly [string, string];
    gradientDark: readonly [string, string];
    /** Default primary blue; use accent for SOS-style emphasis */
    iconVariant?: 'primary' | 'accent';
  };
  stats: HowToUseSlideStat[];
  features: OnboardingFeature[];
  /** Optional related explainer / safety clips shown as soft links under the step */
  relatedVideos?: HowToUseVideoLink[];
};

export const HOW_TO_USE_APP_STEPS: HowToUseStep[] = [
  {
    label: 'Report',
    title: 'Report',
    subtitle: 'Capture evidence from the home camera.',
    hero: {
      Icon: SolarCameraBoldIcon,
      gradientLight: ['#EDEEFF', '#D8DCFF'] as const,
      gradientDark: ['#222236', '#16162a'] as const,
    },
    stats: [
      { value: '1080p', label: 'Typical clip clarity on modern phones' },
      { value: 'Multi', label: 'Photos, video & files in one report' },
    ],
    features: [
      {
        Icon: SolarCameraBoldIcon,
        title: 'Take photos & clips',
        description:
          'Use the shutter to capture what you see. Flip the camera, use flash, or switch modes from the side controls.',
      },
      {
        Icon: SolarGalleryAddBoldIcon,
        title: 'Add what you already have',
        description:
          'Use the + button and gallery strip to attach existing photos or files to your report.',
      },
    ],
    relatedVideos: [
      {
        label: 'Tips for clear phone video as evidence',
        url: topicVideoSearch('smartphone video evidence tips clear footage'),
      },
      {
        label: 'What to capture when documenting an incident',
        url: topicVideoSearch('document incident photos video safely'),
      },
    ],
  },
  {
    label: 'Watch Me',
    title: 'Watch Me',
    subtitle: 'Let people you trust follow your trip.',
    hero: {
      Icon: SolarWalkingBoldIcon,
      gradientLight: ['#E8F6F0', '#D4EFE4'] as const,
      gradientDark: ['#1a2620', '#14221c'] as const,
    },
    stats: [
      { value: 'Live', label: 'Location updates while you are moving' },
      { value: 'Trusted', label: 'Only contacts you explicitly choose' },
    ],
    features: [
      {
        Icon: SolarWalkingBoldIcon,
        title: 'Share your journey',
        description:
          'Start Watch Me so chosen contacts can see your live location until you arrive safely.',
      },
      {
        Icon: SolarMapPointBoldIcon,
        title: 'They know where you are',
        description:
          'If something feels wrong, people who care can react faster because they already see your route.',
      },
    ],
    relatedVideos: [
      {
        label: 'Why live location sharing helps on a walk home',
        url: topicVideoSearch('share live location walk home safety'),
      },
      {
        label: 'Using trusted contacts when you travel alone',
        url: topicVideoSearch('trusted contacts safety app share location'),
      },
    ],
  },
  {
    label: 'SOS',
    title: 'SOS',
    subtitle: 'When you need help right away.',
    hero: {
      Icon: SolarSirenRoundedBoldIcon,
      gradientLight: ['#FFE8EE', '#FFD6E2'] as const,
      gradientDark: ['#321c24', '#261820'] as const,
      iconVariant: 'accent',
    },
    stats: [
      { value: '<3s', label: 'Hold-to-send straight into the flow' },
      { value: '2×', label: 'Tap to review or hold for speed' },
    ],
    features: [
      {
        Icon: SolarSirenRoundedBoldIcon,
        title: 'Tap or hold',
        description:
          'From the Report or Watch Me screen, tap SOS to review before sending. Press and hold SOS to go straight into the emergency flow.',
      },
      {
        Icon: SolarPhoneCallingRoundedBoldIcon,
        title: 'Get help faster',
        description:
          'Follow on-screen steps to alert your contacts and keep capturing evidence.',
      },
    ],
    relatedVideos: [
      {
        label: 'When to use emergency SOS vs calling services',
        url: topicVideoSearch('emergency SOS app when to call help'),
      },
      {
        label: 'Staying calm and following steps in an emergency',
        url: topicVideoSearch('emergency preparedness stay calm steps'),
      },
    ],
  },
  {
    label: 'Broadcast',
    title: 'Broadcast',
    subtitle: 'Official updates in Community.',
    hero: {
      Icon: SolarSpeakerBoldIcon,
      gradientLight: ['#FFF4E8', '#FFE8D4'] as const,
      gradientDark: ['#2a2218', '#221c14'] as const,
    },
    stats: [
      { value: 'Official', label: 'Authorities & services you can trust' },
      { value: 'Local', label: 'General & community views near you' },
    ],
    features: [
      {
        Icon: SolarSpeakerBoldIcon,
        title: 'Stay informed',
        description:
          'Open the Community tab for broadcasts—switch between general and community views to see what matters near you.',
      },
      {
        Icon: SolarInfoCircleBoldIcon,
        title: 'Official messages',
        description:
          'Official broadcasts are from authorities and services. They are read-only; use Report to log an incident.',
      },
    ],
    relatedVideos: [
      {
        label: 'How public safety alerts reach your phone',
        url: topicVideoSearch('public safety emergency alerts phone'),
      },
      {
        label: 'Telling official updates from rumours online',
        url: topicVideoSearch('verify official emergency information sources'),
      },
    ],
  },
];
