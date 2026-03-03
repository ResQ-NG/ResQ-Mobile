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
  ],
  plugins: [
    clean({ patterns: ['src/components/icons'] }),
    reactNative({ outputPath: 'src/components/icons' }),
  ],
} satisfies MoniconConfig;
