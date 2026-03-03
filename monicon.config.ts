import { reactNative, clean } from '@monicon/core/plugins';
import type { MoniconConfig } from '@monicon/core';

export default {
  // Load individual icons by name
  icons: [
    'solar:eye-bold',
    'solar:camera-bold',
    'solar:users-group-rounded-bold',
    'solar:shield-check-bold',
  ],
  // Optional: load whole sets, e.g. collections: ['lucide'],
  plugins: [
    clean({ patterns: ['src/components/icons'] }),
    reactNative({ outputPath: 'src/components/icons' }),
  ],
} satisfies MoniconConfig;
