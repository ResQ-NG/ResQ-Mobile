import { reactNative, clean } from '@monicon/core/plugins';
import type { MoniconConfig } from '@monicon/core';

export default {
  icons: [
    // Onboarding
    'solar:eye-bold',
    'solar:camera-bold',
    'solar:users-group-rounded-bold',
    'solar:shield-check-bold',
    // Tab bar
    'solar:user-speak-bold',
    'solar:settings-bold',
    'solar:map-point-rotate-bold',
    'solar:folder-open-bold',
    // Camera overlay
    'solar:bolt-bold', // flash
    'solar:videocamera-record-bold', // video toggle
    'solar:camera-rotate-bold', // flip camera
    'solar:microphone-bold', // mic
    'solar:text-bold', // text overlay
    'solar:camera-lens-bold', // lens/filter
    'solar:smartphone-rotate-angle-bold',
    'solar:map-arrow-right-bold', // navigate / compass
    'solar:map-point-bold', // location pin (header)
    'solar:bell-bold', // notification (header)
    'solar:clock-circle-bold', // time (header)
    'solar:gallery-add-bold', // add media (bottom left)
    'solar:map-gps-bold', // GPS (header/location)
    // Settings
    'solar:lock-keyhole-bold',
    'solar:info-circle-bold',
    'hugeicons:arrow-right-01',

    // Community
    'solar:user-speak-bold',
    'solar:users-group-rounded-bold',
    'solar:shield-check-bold',
    'solar:lock-keyhole-bold',
    'solar:info-circle-bold',
    'solar:bell-bold',
    'solar:clock-circle-bold',
    'solar:gallery-add-bold',
    'solar:arrow-left-broken',
    'mingcute:search-line',



  ],
  plugins: [
    clean({ patterns: ['src/components/icons'] }),
    reactNative({ outputPath: 'src/components/icons' }),
  ],
} satisfies MoniconConfig;
