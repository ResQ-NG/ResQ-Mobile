import { View } from 'react-native';
import {
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeInUp,
} from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAppColorScheme } from '@/theme/colorMode';
import { DestinationSearchInput } from './DestinationSearchInput';

interface CheckSafetyStepProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onCheckPress: () => void;
  onStartWatchMePress?: () => void;
  canStartWatchMe?: boolean;
  isChecking?: boolean;
  bottomInset?: number;
}

export function CheckSafetyStep({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onCheckPress,
  onStartWatchMePress,
  canStartWatchMe = false,
  isChecking = false,
  bottomInset = 0,
}: CheckSafetyStepProps) {
  const { theme } = useAppColorScheme();

  const handlePrimaryPress =
    canStartWatchMe && onStartWatchMePress ? onStartWatchMePress : onCheckPress;

  const ctaLabel = isChecking
    ? 'Checking route...'
    : canStartWatchMe
      ? 'Start Watch Me'
      : 'Check safety';

  return (
    <>
      <AppAnimatedScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottomInset + 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* From */}
        <AppAnimatedView entering={brandFadeInUp.delay(40)} className="mt-5 mb-5">
          <AppHeading
            level={6}
            className="text-primaryDark font-metropolis-semibold dark:text-primaryDark-dark mb-2"
          >
            Where are you starting from?
          </AppHeading>
          <DestinationSearchInput
            value={origin}
            onChangeText={onOriginChange}
            placeholder="Search or type starting point"
          />
        </AppAnimatedView>

        {/* To */}
        <AppAnimatedView entering={brandFadeInUp.delay(100)} className="mb-6">
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

        <AppAnimatedView entering={brandFadeInUp.delay(160)} className="mb-4">
          <View
            className="rounded-2xl px-4 py-3"
            style={{ backgroundColor: theme.surfaceBackground }}
          >
            <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
              We&apos;ll check how safe this route looks based on recent Watch Me
              activity around it.
            </AppText>
          </View>
        </AppAnimatedView>
      </AppAnimatedScrollView>

      {/* CTA – fixed at bottom */}
      <AppAnimatedView
        entering={brandFadeInUp.delay(220)}
        className="absolute left-0 right-0 bottom-0 px-4 bg-white dark:bg-black"
        style={{ paddingBottom: bottomInset + 16, paddingTop: 16 }}
      >
        <AppButton
          onPress={handlePrimaryPress}
          variant="primary"
          size="lg"
          disabled={isChecking || !destination}
          className="w-full"
        >
          {ctaLabel}
        </AppButton>
      </AppAnimatedView>
    </>
  );
}

