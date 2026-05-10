import { Pressable, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Avatar, avatarRemoteSource } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';
import type { InboundPeer } from '@/network/modules/emergency-contacts/types';

type Props = {
  peer: InboundPeer;
  selected: boolean;
  onToggle: () => void;
};

export function WatchMeOnboardingInboundPeerRow({
  peer,
  selected,
  onToggle,
}: Props) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${peer.full_name}, ${selected ? 'selected' : 'not selected'}`}
      className={cn(
        'mb-3 flex-row items-center gap-4 rounded-2xl border px-4 py-3 active:opacity-90',
        selected
          ? 'border-primary-blue dark:border-primary-blue-dark bg-primary-blue/8 dark:bg-primary-blue-dark/15'
          : 'border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] bg-white dark:bg-[#1a1a1a]'
      )}
    >
      <Avatar
        size={48}
        source={avatarRemoteSource(peer.avatar_url)}
        altText={peer.full_name}
      />
      <AppText className="flex-1 text-[16px] font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
        {peer.full_name}
      </AppText>
      <View
        className={cn(
          'h-6 w-6 items-center justify-center rounded-full border-2',
          selected
            ? 'border-primary-blue dark:border-primary-blue-dark bg-primary-blue dark:bg-primary-blue-dark'
            : 'border-gray-300 dark:border-gray-600'
        )}
      >
        {selected ? <View className="h-2 w-2 rounded-full bg-white" /> : null}
      </View>
    </Pressable>
  );
}
