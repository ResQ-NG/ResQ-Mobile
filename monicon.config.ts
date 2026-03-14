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

    'solar:archive-minimalistic-bold',
    'solar:text-square-bold',
    'solar:trash-bin-2-bold-duotone',
    'solar:alt-arrow-down-bold',
    'solar:file-bold',

    'solar:share-bold',
    'solar:download-bold',
    'solar:delete-bin-2-bold',
    'solar:reel-bold',


    'mingcute:car-3-fill',
    'solar:bus-bold',
    'solar:tram-bold',
    'solar:walking-bold',
    'solar:bicycle-bold',
    'solar:scooter-bold',

    'solar:siren-rounded-bold',
    'solar:play-stream-bold',

    // SOS agencies: call and chat
    'solar:phone-calling-rounded-bold',
    'solar:chat-round-dots-bold',

    // Calls and chat
    'solar:close-circle-bold', // end call / end chat / dismiss
    'solar:speaker-bold', // speaker (in-call)
    'solar:plain-2-bold', // send message
    'solar:minimize-square-2-bold', // compress / minimize (call & chat screen)
    'solar:maximize-square-2-bold', // expand (floating banner: open call/chat)
  ],
  plugins: [
    clean({ patterns: ['src/components/icons'] }),
    reactNative({ outputPath: 'src/components/icons' }),
  ],
} satisfies MoniconConfig;
