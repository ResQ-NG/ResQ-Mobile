import {
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarClockCircleBoldIcon from '@/components/icons/solar/clock-circle-bold';
import { useAppColorScheme } from '@/theme/colorMode';
import { WatchMeContactSection } from './WatchMeContactSection';
import type { WatchMeContactGroup } from './WatchMeContactSection';

interface StartWatchMeStepProps {
  currentLocation: string;
  destination: string;
  estimatedArrival: string;
  onCurrentLocationChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onEstimatedArrivalChange: (value: string) => void;
  groups: WatchMeContactGroup[];
  selectedIds: Set<string>;
  onToggleContact: (id: string) => void;
  onViewMorePress: () => void;
  onStartPress: () => void;
  /** Bottom inset for fixed CTA (safe area). */
  bottomInset?: number;
}

export function StartWatchMeStep({
  currentLocation,
  destination,
  estimatedArrival,
  onCurrentLocationChange,
  onDestinationChange,
  onEstimatedArrivalChange,
  groups,
  selectedIds,
  onToggleContact,
  onViewMorePress,
  onStartPress,
  bottomInset = 0,
}: StartWatchMeStepProps) {
  const { theme } = useAppColorScheme();

  return (
    <>
      <AppAnimatedScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomInset + 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Your current location */}
        <AppAnimatedView
          entering={brandFadeInUp.delay(60)}
          className="px-4 mb-5"
        >
          <AppHeading
            level={5}
            className="text-primaryDark font-metropolis-bold dark:text-primaryDark-dark mb-2"
          >
            Your current location
          </AppHeading>
          <AppInput
            value={currentLocation}
            onChangeText={onCurrentLocationChange}
            placeholder="Enter location"
            className="rounded-full"
            leftIcon={
              <SolarMapPointBoldIcon width={20} height={20} color={theme.textMuted} />
            }
          />
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark mt-1.5"
          >
            Your GPS location will be automatically captured
          </AppText>
        </AppAnimatedView>

        {/* Where are you going? */}
        <AppAnimatedView
          entering={brandFadeInUp.delay(120)}
          className="px-4 mb-5"
        >
          <AppHeading
            level={5}
            className="text-primaryDark font-metropolis-semibold dark:text-primaryDark-dark mb-2"
          >
            Where are you going?
          </AppHeading>
          <AppInput
            value={destination}
            onChangeText={onDestinationChange}
            placeholder="Enter destination"
            className="rounded-full "
            leftIcon={
              <SolarMapPointBoldIcon width={20} height={20} color={theme.textMuted} />
            }
          />
        </AppAnimatedView>

        {/* Estimated arrival time */}
        <AppAnimatedView
          entering={brandFadeInUp.delay(180)}
          className="px-4 mb-6"
        >
          <AppHeading
            level={5}
            className="text-primaryDark font-metropolis-semibold dark:text-primaryDark-dark mb-2"
          >
            Estimated arrival time
          </AppHeading>
          <AppInput
            value={estimatedArrival}
            onChangeText={onEstimatedArrivalChange}
            placeholder="Enter"
            className="rounded-full"
            leftIcon={
              <SolarClockCircleBoldIcon width={20} height={20} color={theme.textMuted} />
            }
          />
        </AppAnimatedView>

        <WatchMeContactSection
          groups={groups}
          selectedIds={selectedIds}
          onToggleContact={onToggleContact}
          onViewMorePress={onViewMorePress}
          enteringDelay={240}
        />
      </AppAnimatedScrollView>

      {/* Start watch me – fixed at bottom */}
      <AppAnimatedView
        entering={brandFadeInUp.delay(320)}
        className="absolute left-0 right-0 bottom-0 px-4 bg-white dark:bg-black"
        style={{ paddingBottom: bottomInset + 16, paddingTop: 16 }}
      >
        <AppButton
          onPress={onStartPress}
          variant="primary"
          size="lg"
          className="w-full bg-[#9B87F5] dark:bg-[#8B77E5]"
        >
          Start watch me
        </AppButton>
      </AppAnimatedView>
    </>
  );
}
