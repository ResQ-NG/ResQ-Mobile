import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS, avatarRemoteSource } from '@/components/ui';
import { useAppColorScheme } from '@/theme/colorMode';
import type { UiEmergencyContact } from '@/network/modules/emergency-contacts/utils';

interface ActiveWatchersListProps {
  contacts: UiEmergencyContact[];
  sessionContactIds: string[];
  onRemove: (id: string) => void;
  onAddMore: () => void;
}

export function ActiveWatchersList({
  contacts,
  sessionContactIds,
  onRemove,
  onAddMore,
}: ActiveWatchersListProps) {
  const { theme } = useAppColorScheme();

  const activeContacts = contacts.filter((c) =>
    sessionContactIds.includes(c.id)
  );

  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
          Watching ({activeContacts.length})
        </AppText>
        <TouchableOpacity
          onPress={onAddMore}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ backgroundColor: theme.surfaceBackground }}
          accessibilityLabel="Add more contacts to session"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={16} color={theme.primaryBlue} />
          <AppText
            className="font-metropolis-medium text-xs"
            style={{ color: theme.primaryBlue }}
          >
            Add more
          </AppText>
        </TouchableOpacity>
      </View>

      {activeContacts.length === 0 ? (
        <Animated.View
          entering={FadeInDown.springify()}
          className="rounded-2xl p-5 items-center gap-2"
          style={{ backgroundColor: theme.surfaceBackground }}
        >
          <Ionicons name="people-outline" size={28} color={theme.textMuted} />
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark text-center"
          >
            No contacts are watching yet. Add some above.
          </AppText>
        </Animated.View>
      ) : (
        <View className="gap-2">
          {activeContacts.map((contact, index) => (
            <Animated.View
              key={contact.id}
              entering={FadeInDown.delay(index * 60).springify()}
              exiting={FadeOutLeft.springify()}
              className="flex-row items-center gap-3 rounded-2xl p-3"
              style={{ backgroundColor: theme.surfaceBackground }}
            >
              <Avatar
                size={44}
                source={avatarRemoteSource(contact.avatarUrl)}
                backgroundColor={
                  AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length]
                }
                altText={contact.name}
              />
              <View className="flex-1 min-w-0">
                <AppText
                  className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark"
                  numberOfLines={1}
                >
                  {contact.name}
                </AppText>
                <AppText
                  variant="caption"
                  className="text-captionDark dark:text-captionDark-dark"
                  numberOfLines={1}
                >
                  {contact.phone ?? contact.email ?? 'Contact'}
                </AppText>
              </View>

              <View
                className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1 mr-2"
                style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
              >
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#22c55e' }}
                />
                <AppText className="text-xs font-metropolis-medium text-green-600 dark:text-green-400">
                  Watching
                </AppText>
              </View>

              <TouchableOpacity
                onPress={() => onRemove(contact.id)}
                activeOpacity={0.7}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.surfaceBackground }}
                accessibilityLabel={`Remove ${contact.name} from session`}
                accessibilityRole="button"
              >
                <Ionicons
                  name="close-circle-outline"
                  size={22}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
}
