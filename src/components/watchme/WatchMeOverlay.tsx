import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppButton } from '@/components/ui';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';
import type { ActiveWatch } from './types';
import { WatchMeContactList } from './WatchMeContactList';
import { WatchMeSidebar } from './WatchMeSidebar';
import { WatchMeLocationPill } from './WatchMeLocationPill';
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
  onNotificationPress?: () => void;
}

export function WatchMeOverlay({
  location = 'Maryland, Lagos.',
  watches,
  selectedWatchId: _selectedWatchId = null,
  onSelectContact,
  onCloseProfile: _onCloseProfile,
  onStartWatchMe,
  onExpandPress,
  onResetLocation,
  onSosPress,
  onSearchPress,
  onNotificationPress,
}: WatchMeOverlayProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();
  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom + 16;
  const isSessionActive = useWatchMeContactsStore((s) => s.isSessionActive);

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <WatchMeLocationPill location={location} />

      <AppAnimatedView
        entering={brandFadeInUp.delay(40)}
        style={{
          position: 'absolute',
          right: 16,
          top: insets.top + 16,
        }}
      >
        <TouchableOpacity
          onPress={onNotificationPress}
          className="w-12 h-12 rounded-full bg-[rgba(18,18,18,0.75)] border border-[rgba(255,255,255,0.12)] items-center justify-center"
        >
          <SolarBellBoldIcon
            width={22}
            height={22}
            color={theme.iconOnAccent}
          />
        </TouchableOpacity>
      </AppAnimatedView>

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
          If there are no contacts, show "Add Contact"; if session active show session card; else Start Watch Me.
          Contact profile is shown in the watch-me-status modal, not inline.
        */}
        {watches.length === 0 ? (
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
          ) : null}

        <WatchMeContactList
          watches={watches}
          onSelectContact={onSelectContact}
          onExpandPress={onExpandPress}
        />
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
