import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';

export interface WatchMeContact {
  id: string;
  name: string;
  maskedPhone: string;
  /** Optional image; when missing, uses Avatar with default/initials */
  avatarSource?: { uri: string } | null;
  avatarBgIndex?: number;
}

interface WatchMeContactCardProps {
  contact: WatchMeContact;
  selected: boolean;
  onPress: () => void;
}

export function WatchMeContactCard({
  contact,
  selected,
  onPress,
}: WatchMeContactCardProps) {
  const bg = contact.avatarBgIndex ?? 0;

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
        <Avatar
          size={56}
          source={contact.avatarSource}
          backgroundColor={AVATAR_BACKGROUNDS[bg % AVATAR_BACKGROUNDS.length]}
          altText={contact.name}
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

interface ViewMoreCardProps {
  onPress: () => void;
}

export function WatchMeViewMoreCard({ onPress }: ViewMoreCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-1 rounded-2xl bg-surface-light dark:bg-surface-dark p-4 items-center justify-center"
    >
      <View className="w-20 h-20 rounded-full bg-white dark:bg-black items-center justify-center">
        <View className="w-10 h-10 rounded-full bg-primary-blue dark:bg-primary-blue-dark items-center justify-center">
          <AppText className="text-white text-center dark:text-white text-3xl font-bold">
            +
          </AppText>
        </View>
      </View>

      <AppText className="mt-2 font-metropolis-medium text-primaryDark dark:text-primaryDark-dark">
        View more
      </AppText>
    </TouchableOpacity>
  );
}
