import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { EmergencyContactAvatarWithBadge } from './EmergencyContactAvatarWithBadge';

export interface WatchMeContact {
  id: string;
  name: string;
  maskedPhone: string;
  /** Optional image; when missing, uses Avatar with default/initials */
  avatarSource?: { uri: string } | null;
  avatarBgIndex?: number;
  isAppUser?: boolean;
}

interface WatchMeContactCardProps {
  contact: WatchMeContact;
  selected: boolean;
  onPress: () => void;
  /** Grey “Invite” pill instead of amber (Start Watch Me). */
  inviteBadgeMuted?: boolean;
}

export function WatchMeContactCard({
  contact,
  selected,
  onPress,
  inviteBadgeMuted = false,
}: WatchMeContactCardProps) {
  const bg = contact.avatarBgIndex ?? 0;
  const uri =
    contact.avatarSource &&
    'uri' in contact.avatarSource &&
    contact.avatarSource.uri
      ? contact.avatarSource.uri
      : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-1 rounded-2xl overflow-hidden bg-white dark:bg-black border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] p-4"
    >
      <View className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full border-2 border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.3)] items-center justify-center">
        {selected ? (
          <View className="w-2.5 h-2.5 rounded-full bg-primary-blue dark:bg-primary-blue-dark" />
        ) : null}
      </View>
      <View className="items-center">
        <EmergencyContactAvatarWithBadge
          size={56}
          altText={contact.name}
          backgroundColor={AVATAR_BACKGROUNDS[bg % AVATAR_BACKGROUNDS.length]}
          avatarUrl={uri}
          isAppUser={contact.isAppUser ?? false}
          inviteBadgeMuted={inviteBadgeMuted}
        />
        <AppText
          className="mt-2 font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark text-center"
          numberOfLines={1}
        >
          {contact.name}
        </AppText>
        <AppText
          className="text-xs text-captionDark dark:text-captionDark-dark mt-0.5"
          numberOfLines={1}
        >
          {contact.maskedPhone}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
