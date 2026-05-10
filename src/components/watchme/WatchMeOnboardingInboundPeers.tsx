import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAppColorScheme } from '@/theme/colorMode';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAcceptInboundPeer } from '@/network/modules/emergency-contacts/queries';
import type { InboundPeer } from '@/network/modules/emergency-contacts/types';
import { WatchMeOnboardingInboundPeerRow } from './WatchMeOnboardingInboundPeerRow';

type Props = {
  peers: InboundPeer[];
  inboundLoading: boolean;
  onAddSomeoneElse: () => void;
  onSkip: () => void;
};

export function WatchMeOnboardingInboundPeers({
  peers,
  inboundLoading,
  onAddSomeoneElse,
  onSkip,
}: Props) {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const [selectedPeerIds, setSelectedPeerIds] = useState<Set<number>>(
    () => new Set()
  );

  useEffect(() => {
    setSelectedPeerIds(new Set(peers.map((p) => p.user_id)));
  }, [peers]);

  const { mutate: acceptInboundPeers, isPending: acceptingPeers } =
    useAcceptInboundPeer();

  const togglePeer = useCallback((userId: number) => {
    setSelectedPeerIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const handleAddSelectedPeers = usePreventDoublePress(() => {
    const ids = [...selectedPeerIds];
    if (ids.length === 0) return;
    acceptInboundPeers(
      { user_ids: ids },
      {
        onSuccess: () => router.back(),
      }
    );
  });

  const openManualContacts = usePreventDoublePress(onAddSomeoneElse);

  return (
    <>
      <AppAnimatedScrollView
        className="flex-1 pt-2"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppAnimatedView entering={brandFadeIn}>
          <AppText
            variant="caption"
            className="mb-2 font-metropolis-semibold uppercase tracking-wide text-primary-blue dark:text-primary-blue-dark"
          >
            People you may know
          </AppText>
          <AppHeading level={2} className="mb-2">
            Friends already on ResQ
          </AppHeading>
          <AppText
            variant="body"
            className="mb-6 text-captionDark dark:text-captionDark-dark"
          >
            These contacts added you before you joined. Add them here so you can
            share Watch Me and SOS with people who already chose you.
          </AppText>
        </AppAnimatedView>

        {inboundLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color={theme.primaryBlue} />
          </View>
        ) : (
          peers.map((peer) => (
            <WatchMeOnboardingInboundPeerRow
              key={peer.user_id}
              peer={peer}
              selected={selectedPeerIds.has(peer.user_id)}
              onToggle={() => togglePeer(peer.user_id)}
            />
          ))
        )}

        <Pressable
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip adding contacts for now"
          className="mt-4 items-center py-2 active:opacity-70"
        >
          <AppText
            variant="body"
            className="text-captionDark dark:text-captionDark-dark underline"
          >
            Skip for now
          </AppText>
        </Pressable>
      </AppAnimatedScrollView>

      <View
        className={`absolute left-0 right-0 bottom-0 ${theme.background}`}
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="gap-3 px-6 pb-6 pt-4">
          <AppButton
            variant="primary"
            size="lg"
            className="w-full"
            onPress={handleAddSelectedPeers}
            disabled={selectedPeerIds.size === 0}
            loading={acceptingPeers}
          >
            Add selected to contacts
          </AppButton>
          <AppButton
            variant="outline"
            size="lg"
            className="w-full"
            onPress={openManualContacts}
            disabled={acceptingPeers}
          >
            Add someone else instead
          </AppButton>
        </View>
      </View>
    </>
  );
}
