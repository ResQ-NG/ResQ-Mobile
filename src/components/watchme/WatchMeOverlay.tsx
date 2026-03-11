import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppButton } from '@/components/ui';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { ACTIVE_WATCHES_MOCK } from './types';
import { WatchMeProfileCard } from './WatchMeProfileCard';
import { WatchMeContactList } from './WatchMeContactList';
import { WatchMeSidebar } from './WatchMeSidebar';
import { WatchMeLocationPill } from './WatchMeLocationPill';
import { WatchMeCloseButton } from './WatchMeCloseButton';

interface WatchMeOverlayProps {
  location?: string;
  /** Controlled: which contact is selected (profile open + map focused on them when availableOnMap) */
  selectedWatchId?: string | null;
  onSelectContact: (id: string) => void;
  onCloseProfile: () => void;
  onStartWatchMe?: () => void;
  onExpandPress?: () => void;
  onResetLocation?: () => void;
}

export function WatchMeOverlay({
  location = 'Maryland, Lagos.',
  selectedWatchId = null,
  onSelectContact,
  onCloseProfile,
  onStartWatchMe,
  onExpandPress,
  onResetLocation,
}: WatchMeOverlayProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom + 16;

  const selectedWatch = selectedWatchId
    ? ACTIVE_WATCHES_MOCK.find((w) => w.id === selectedWatchId)
    : null;

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      {selectedWatch ? (
        <WatchMeCloseButton onPress={onCloseProfile} />
      ) : null}

      <WatchMeLocationPill location={location} />

      {/* Bottom bar + Start Watch Me button in one anchored column so the button moves with the bar */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: bottomOffset,
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 12,
          zIndex: 20,
        }}
      >
        {onStartWatchMe && !selectedWatch ? (
          <AppAnimatedView
            entering={brandFadeInUp.delay(80)}
            className="px-4"
          >
            <AppButton
              variant="secondary"
              size="lg"
              className="w-full bg-success-green dark:bg-success-green-dark border-0"
              labelClassName="text-white"
              onPress={onStartWatchMe}
            >
              Start Watch Me
            </AppButton>
          </AppAnimatedView>
        ) : null}

        <AppAnimatedView
          entering={brandFadeInUp.delay(80)}
          className="bg-[rgba(255,255,255,0.96)] dark:bg-[rgba(18,18,18,0.95)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.16)] px-5 rounded-[3rem]"
          style={{
            marginHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 20,
          }}
        >
          {selectedWatch ? (
            <WatchMeProfileCard watch={selectedWatch} />
          ) : (
            <WatchMeContactList
              watches={ACTIVE_WATCHES_MOCK}
              onSelectContact={onSelectContact}
              onExpandPress={onExpandPress}
            />
          )}
        </AppAnimatedView>
      </View>

      <WatchMeSidebar
        onResetLocation={onResetLocation}
        onExpandPress={onExpandPress}
      />
    </View>
  );
}
