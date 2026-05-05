import { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppColorScheme } from '@/theme/colorMode';
import { AppText } from '@/components/ui/AppText';
import { AppInfoCallout } from '@/components/ui/AppInfoCallout';
import { AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { emergencyContactsReachabilityCopy } from '@/lib/content/emergency-contacts-reachability-info';
import {
  formatEmergencyContactReachabilityLine,
  type UiEmergencyContact,
} from '@/network/modules/emergency-contacts/utils';
import { EmergencyContactAvatarWithBadge } from './EmergencyContactAvatarWithBadge';

export type { UiEmergencyContact };

type Props = {
  contacts: UiEmergencyContact[];
  onRequestRemove: (contact: UiEmergencyContact) => void;
  /** When set, tapping a non–app-user row opens invite (avatar + name area). */
  onInviteContact?: (contact: UiEmergencyContact) => void;
  onRequestEdit?: (contact: UiEmergencyContact) => void;
  /** Watch Me map tab: hide invite pill and dim non–app avatars. */
  listAppearance?: 'default' | 'watchMap';
};

function RelationshipBadge({
  label,
  isDark,
}: {
  label: string;
  isDark: boolean;
}) {
  return (
    <View
      className="rounded-full px-2.5 py-1 border"
      style={{
        backgroundColor: isDark
          ? 'rgba(16, 185, 129, 0.14)'
          : 'rgba(209, 250, 229, 0.95)',
        borderColor: isDark
          ? 'rgba(52, 211, 153, 0.35)'
          : 'rgba(16, 185, 129, 0.35)',
      }}
    >
      <AppText
        className="text-[11px] font-metropolis-semibold uppercase tracking-wide"
        style={{ color: isDark ? '#6EE7B7' : '#047857' }}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </View>
  );
}

export function WatchMeSheetContactList({
  contacts,
  onRequestRemove,
  onInviteContact,
  onRequestEdit,
  listAppearance = 'default',
}: Props) {
  const { theme, isDark } = useAppColorScheme();
  const isWatchMapList = listAppearance === 'watchMap';
  const canEdit = typeof onRequestEdit === 'function';

  const openRowMenu = useCallback(
    (contact: UiEmergencyContact) => {
      const title = contact.name;
      const runEdit = () => onRequestEdit?.(contact);
      const runDelete = () => onRequestRemove(contact);

      if (Platform.OS === 'ios') {
        if (canEdit) {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              title,
              options: ['Cancel', 'Edit', 'Delete'],
              cancelButtonIndex: 0,
              destructiveButtonIndex: 2,
            },
            (i) => {
              if (i === 1) runEdit();
              if (i === 2) runDelete();
            }
          );
        } else {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              title,
              options: ['Cancel', 'Delete'],
              cancelButtonIndex: 0,
              destructiveButtonIndex: 1,
            },
            (i) => {
              if (i === 1) runDelete();
            }
          );
        }
        return;
      }

      if (canEdit) {
        Alert.alert(title, undefined, [
          { text: 'Edit', onPress: runEdit },
          { text: 'Delete', style: 'destructive', onPress: runDelete },
          { text: 'Cancel', style: 'cancel' },
        ]);
      } else {
        Alert.alert(title, undefined, [
          { text: 'Delete', style: 'destructive', onPress: runDelete },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    },
    [canEdit, onRequestEdit, onRequestRemove]
  );

  const copy = emergencyContactsReachabilityCopy;

  return (
    <View>
      {contacts.length === 0 ? (
        <AppInfoCallout title={copy.emptyWhyTitle} className="mx-4 mb-4">
          <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
            {copy.emptyWhyBody}
          </AppText>
          <AppText className="text-sm text-captionDark dark:text-captionDark-dark mt-3">
            {copy.emptyReachBody}
          </AppText>
        </AppInfoCallout>
      ) : (
        <AppInfoCallout title={copy.reachTitle} className="mx-4 mb-4">
          <AppText className="text-sm text-captionDark dark:text-captionDark-dark">
            {copy.reachBody}
          </AppText>
        </AppInfoCallout>
      )}

      <View style={{ paddingHorizontal: 16 }}>
        <View className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark">
          {contacts.map((contact, index) => {
            const canInvite =
              !contact.isAppUser && typeof onInviteContact === 'function';
            const avatarBlock = (
              <EmergencyContactAvatarWithBadge
                size={36}
                altText={contact.name}
                backgroundColor={
                  AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length]
                }
                avatarUrl={contact.avatarUrl}
                isAppUser={contact.isAppUser}
                hideInviteBadge={isWatchMapList}
                dimNonAppAvatar={isWatchMapList}
              />
            );
            const textBlock = (
              <View className="flex-1 min-w-0">
                <AppText
                  variant="body"
                  className="font-metropolis-medium"
                  numberOfLines={1}
                >
                  {contact.name}
                </AppText>
                <View className="flex-row flex-wrap items-center gap-2 mt-1">
                  <AppText
                    variant="caption"
                    className="text-sm text-captionDark dark:text-captionDark-dark"
                    numberOfLines={1}
                  >
                    {formatEmergencyContactReachabilityLine(contact)}
                  </AppText>
                  {contact.relationshipLabel ? (
                    <RelationshipBadge
                      label={contact.relationshipLabel}
                      isDark={isDark}
                    />
                  ) : null}
                </View>
              </View>
            );

            return (
              <View
                key={contact.id}
                className="flex-row items-center gap-3 px-4 py-3.5"
              >
                {canInvite ? (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => onInviteContact?.(contact)}
                    className="flex-1 flex-row items-center gap-3 min-w-0"
                    accessibilityRole="button"
                    accessibilityLabel={`Invite ${contact.name}`}
                  >
                    {avatarBlock}
                    {textBlock}
                  </TouchableOpacity>
                ) : (
                  <View className="flex-1 flex-row items-center gap-3 min-w-0">
                    {avatarBlock}
                    {textBlock}
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => openRowMenu(contact)}
                  hitSlop={12}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`More options for ${contact.name}`}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={22}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
