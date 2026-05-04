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
import { WatchMeContactSection } from '@/components/watchme/WatchMeContactSection';
import type { WatchMeContactGroup } from '@/components/watchme/WatchMeContactSection';
import { DestinationSearchInput } from '@/components/watchme/DestinationSearchInput';
import MingcuteCar3FillIcon from '@/components/icons/mingcute/car-3-fill';
import formatArrivalTime from './formatArrivalTime';

export type TransportationMode =
  | 'walking'
  | 'driving'
  | 'public_transit'
  | 'motorcycle'
  | 'train';

const TRANSPORT_OPTIONS: {
  value: TransportationMode;
  label: string;
  Icon: React.ComponentType<{
    width?: number;
    height?: number;
    color?: string;
  }>;
}[] = [
  { value: 'walking', label: 'Walking', Icon: SolarWalkingBoldIcon },
  { value: 'driving', label: 'Driving', Icon: MingcuteCar3FillIcon },
  { value: 'public_transit', label: 'Public transit', Icon: SolarBusBoldIcon },
  { value: 'motorcycle', label: 'Motorcycle', Icon: SolarScooterBoldIcon },
  { value: 'train', label: 'Train', Icon: SolarTramBoldIcon },
];

/** Default drive duration in minutes for ETA (can come from routing API later) */
const DEFAULT_ARRIVAL_MINUTES = 30;

export interface StartWatchMeStepProps {
  destination: string;
  onDestinationChange: (value: string) => void;
  transportation: TransportationMode | null;
  onTransportationChange: (value: TransportationMode) => void;
  groups: WatchMeContactGroup[];
  selectedIds: Set<string>;
  onToggleContact: (id: string) => void;
  onSelectRelationshipGroup: (groupId: string) => void;
  onAddContactPress: () => void;
  onStartPress: () => void;
  isStarting?: boolean;
  bottomInset?: number;
}

export default function StartWatchMeStep({
  destination,
  onDestinationChange,
  transportation,
  onTransportationChange,
  groups,
  selectedIds,
  onToggleContact,
  onSelectRelationshipGroup,
  onAddContactPress,
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
        <AppAnimatedView
          entering={brandFadeInUp.delay(60)}
          className="mt-5 mb-5"
        >
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
                    borderColor: selected
                      ? theme.primaryBlue
                      : theme.avatarBorder,
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
          onSelectRelationshipGroup={onSelectRelationshipGroup}
          onAddContactPress={onAddContactPress}
          inviteBadgeMuted
          enteringDelay={200}
        />
      </AppAnimatedScrollView>

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
