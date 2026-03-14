import { View, TouchableOpacity } from 'react-native';
import { useAppColorScheme } from '@/theme/colorMode';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import SolarTrashBin2BoldDuotoneIcon from '@/components/icons/solar/trash-bin-2-bold-duotone';

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
};

type Props = {
  contacts: EmergencyContact[];
  onRemove: (id: string) => void;
};

export function WatchMeSheetContactList({ contacts, onRemove }: Props) {
  const { theme, themeName } = useAppColorScheme();

  return (
    <View>
      {contacts.length === 0 && (
        <View
          className="mx-4 mb-4 p-4 rounded-2xl flex-row gap-3"
          style={{
            backgroundColor: themeName === 'dark' ? '#153356' : '#E6F0FF',
          }}
        >
          <SolarInfoCircleBoldIcon width={24} height={24} color="#2563eb" />
          <View className="flex-1">
            <AppText className="font-metropolis-bold text-primaryDark dark:text-primaryDark-dark">
              Why do I need emergency contacts?
            </AppText>
            <AppText className="text-sm text-captionDark dark:text-captionDark-dark mt-1">
              {`They'll be notified immediately when you report an emergency or activate Watch Me.`}
            </AppText>
          </View>
        </View>
      )}

      <View style={{ paddingHorizontal: 16 }}>
        <View className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark">
          {contacts.map((contact, index) => (
            <View
              key={contact.id}
              className="flex-row items-center gap-3 px-4 py-3.5"
            >
              <Avatar
                size={36}
                backgroundColor={
                  AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length]
                }
                altText={contact.name}
              />
              <View className="flex-1 min-w-0">
                <AppText
                  variant="body"
                  className="font-metropolis-medium"
                  numberOfLines={1}
                >
                  {contact.name}
                </AppText>
                <AppText
                  variant="caption"
                  className="text-sm mt-0.5"
                  numberOfLines={1}
                >
                  {contact.phone}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => onRemove(contact.id)}
                hitSlop={8}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${contact.name}`}
              >
                <SolarTrashBin2BoldDuotoneIcon
                  width={22}
                  height={22}
                  color={theme.accentRed}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
