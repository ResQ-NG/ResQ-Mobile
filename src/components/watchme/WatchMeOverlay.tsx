import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppButton } from '@/components/ui';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import type { ActiveWatch } from './types';
import { WatchMeProfileCard } from './WatchMeProfileCard';
import { WatchMeContactList } from './WatchMeContactList';
import { WatchMeSidebar } from './WatchMeSidebar';
import { WatchMeLocationPill } from './WatchMeLocationPill';
import { WatchMeCloseButton } from './WatchMeCloseButton';
import { WatchMeSessionCard } from './WatchMeSessionCard';

interface WatchMeOverlayProps {
  location?: string;
  /** List of active watches (from useActiveWatches or API). */
  watches: ActiveWatch[];
  /** Controlled: which contact is selected (profile open + map focused on them when availableOnMap) */
  selectedWatchId?: string | null;
  onSelectContact: (id: string) => void;
  onCloseProfile: () => void;
  onStartWatchMe?: () => void;
  onExpandPress?: () => void;
  onResetLocation?: () => void;
  onSosPress?: () => void;
  onSearchPress?: () => void;
}

export function WatchMeOverlay({
  location = 'Maryland, Lagos.',
  watches,
  selectedWatchId = null,
  onSelectContact,
  onCloseProfile,
  onStartWatchMe,
  onExpandPress,
  onResetLocation,
  onSosPress,
  onSearchPress,
}: WatchMeOverlayProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom + 16;
  const isSessionActive = useWatchMeContactsStore((s) => s.isSessionActive);

  const selectedWatch = selectedWatchId
    ? watches.find((w) => w.id === selectedWatchId)
    : null;

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      {selectedWatch ? <WatchMeCloseButton onPress={onCloseProfile} /> : null}

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
        {/*
          If there are no contacts, show "Add Contact" button inspired by WatchMeContactList.tsx logic;
          if we have contacts, follow previous logic for Start Watch Me, else show Add Contact.
        */}
        {!selectedWatch ? (
          watches.length === 0 ? (
            <AppAnimatedView
              entering={brandFadeInUp.delay(80)}
              className="px-4"
            >
              <AppButton
                variant="primary"
                size="lg"
                className="rounded-full border-0 w-full"
                onPress={onExpandPress}
              >
                Add Contact
              </AppButton>
            </AppAnimatedView>
          ) : isSessionActive ? (
            <WatchMeSessionCard />
          ) : onStartWatchMe ? (
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
          ) : null
        ) : null}

        {selectedWatch ? (
          <AppAnimatedView
            entering={brandFadeInUp.delay(80)}
            className="bg-[rgba(255,255,255,0.96)] dark:bg-[rgba(18,18,18,0.95)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.16)] px-5 rounded-[3rem]"
            style={{
              marginHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 20,
            }}
          >
            <WatchMeProfileCard watch={selectedWatch} />
          </AppAnimatedView>
        ) : (
          <WatchMeContactList
            watches={watches}
            onSelectContact={onSelectContact}
            onExpandPress={onExpandPress}
          />
        )}
      </View>

      <WatchMeSidebar
        onResetLocation={onResetLocation}
        onExpandPress={onExpandPress}
        onSosPress={onSosPress}
        onSearchPress={onSearchPress}
      />
    </View>
  );
}
