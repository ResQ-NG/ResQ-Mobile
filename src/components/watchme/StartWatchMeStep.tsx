import { View, TouchableOpacity } from 'react-native';
import {
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppButton } from '@/components/ui/AppButton';
import SolarClockCircleBoldIcon from '@/components/icons/solar/clock-circle-bold';

import SolarBusBoldIcon from '@/components/icons/solar/bus-bold';

import SolarScooterBoldIcon from '@/components/icons/solar/scooter-bold';
import SolarTramBoldIcon from '@/components/icons/solar/tram-bold';
import SolarWalkingBoldIcon from '@/components/icons/solar/walking-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import { WatchMeContactSection } from './WatchMeContactSection';
import { DestinationSearchInput } from './DestinationSearchInput';
import type { WatchMeContactGroup } from './WatchMeContactSection';
import MingcuteCar3FillIcon from '../icons/mingcute/car-3-fill';

export type TransportationMode = 'walking' | 'driving' | 'public_transit' | 'motorcycle' | 'train';

const TRANSPORT_OPTIONS: {
  value: TransportationMode;
  label: string;
  Icon: React.ComponentType<{ width?: number; height?: number; color?: string }>;
}[] = [
  { value: 'walking', label: 'Walking', Icon: SolarWalkingBoldIcon },
  { value: 'driving', label: 'Driving', Icon: MingcuteCar3FillIcon },
  { value: 'public_transit', label: 'Public transit', Icon: SolarBusBoldIcon },
  { value: 'motorcycle', label: 'Motorcycle', Icon: SolarScooterBoldIcon },
  { value: 'train', label: 'Train', Icon: SolarTramBoldIcon },
];

/** Default drive duration in minutes for ETA (can come from routing API later) */
const DEFAULT_ARRIVAL_MINUTES = 30;

function formatArrivalTime(minutesFromNow: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutesFromNow);
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface StartWatchMeStepProps {
  destination: string;
  onDestinationChange: (value: string) => void;
  /** Selected means of transportation */
  transportation: TransportationMode | null;
  onTransportationChange: (value: TransportationMode) => void;
  groups: WatchMeContactGroup[];
  selectedIds: Set<string>;
  onToggleContact: (id: string) => void;
  onViewMorePress: () => void;
  onStartPress: () => void;
  /** When true, the Start button is disabled (e.g. during route safety check). */
  isStarting?: boolean;
  /** Bottom inset for fixed CTA (safe area). */
  bottomInset?: number;
}

export function StartWatchMeStep({
  destination,
  onDestinationChange,
  transportation,
  onTransportationChange,
  groups,
  selectedIds,
  onToggleContact,
  onViewMorePress,
  onStartPress,
  isStarting = false,
  bottomInset = 0,
}: StartWatchMeStepProps) {
  const { theme } = useAppColorScheme();
  const arrivalTime = formatArrivalTime(DEFAULT_ARRIVAL_MINUTES);

  return (
    <>
      <AppAnimatedScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomInset + 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Where are you going? */}
        <AppAnimatedView entering={brandFadeInUp.delay(60)} className="mt-5 mb-5">
          <AppHeading
            level={6}
            className="text-primaryDark font-metropolis-semibold dark:text-primaryDark-dark mb-2"
          >
            Where are you going?
          </AppHeading>
          <DestinationSearchInput
            value={destination}
            onChangeText={onDestinationChange}
            placeholder="Search or type destination"
          />
        </AppAnimatedView>

        {/* Estimated arrival – time you'd probably arrive */}
        <AppAnimatedView entering={brandFadeInUp.delay(120)} className="mb-6">
          <AppHeading
            level={6}
            className="text-primaryDark font-metropolis-semibold dark:text-primaryDark-dark mb-2"
          >
            Estimated arrival
          </AppHeading>
          <AppAnimatedView
            className="flex-row items-center gap-2 rounded-full min-h-[48px] px-4 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]"
            style={{ backgroundColor: theme.surfaceBackground }}
          >
            <SolarClockCircleBoldIcon
              width={20}
              height={20}
              color={theme.textMuted}
            />
            <AppText className="font-metropolis-regular text-primaryDark dark:text-primaryDark-dark">
              You{"'"}d arrive around {arrivalTime}
            </AppText>
          </AppAnimatedView>
        </AppAnimatedView>

        {/* Means of transportation */}
        <AppAnimatedView entering={brandFadeInUp.delay(160)} className="mb-6">
          <AppHeading
            level={6}
            className="text-primaryDark font-metropolis-semibold dark:text-primaryDark-dark mb-2"
          >
            Means of transportation
          </AppHeading>
          <View className="flex-row flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((opt) => {
              const selected = transportation === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => onTransportationChange(opt.value)}
                  activeOpacity={0.7}
                  className="rounded-full px-4 py-2.5 border min-h-[44px] flex-row items-center justify-center gap-2"
                  style={{
                    backgroundColor: selected
                      ? theme.primaryBlue
                      : theme.surfaceBackground,
                    borderColor: selected ? theme.primaryBlue : theme.avatarBorder,
                  }}
                >
                  <opt.Icon
                    width={18}
                    height={18}
                    color={selected ? '#fff' : theme.textMuted}
                  />
                  <AppText
                    className={`font-metropolis-medium text-sm ${
                      selected
                        ? 'text-white'
                        : 'text-primaryDark dark:text-primaryDark-dark'
                    }`}
                  >
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </AppAnimatedView>

        <WatchMeContactSection
          groups={groups}
          selectedIds={selectedIds}
          onToggleContact={onToggleContact}
          onViewMorePress={onViewMorePress}
          enteringDelay={200}
        />
      </AppAnimatedScrollView>

      {/* Start watch me – fixed at bottom */}
      <AppAnimatedView
        entering={brandFadeInUp.delay(280)}
        className="absolute left-0 right-0 bottom-0 px-4 bg-white dark:bg-black"
        style={{ paddingBottom: bottomInset + 16, paddingTop: 16 }}
      >
        <AppButton
          onPress={onStartPress}
          variant="primary"
          size="lg"
          disabled={isStarting}
          className="w-full"
        >
          {isStarting ? 'Checking route...' : 'Start watch me'}
        </AppButton>
      </AppAnimatedView>
    </>
  );
}
