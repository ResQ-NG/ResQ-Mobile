import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AppAnimatedView,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAppColorScheme } from '@/theme/colorMode';
import { WatchMeContactCard, type WatchMeContact } from './WatchMeContactCard';

const CARD_HEIGHT = 132;

/** A named group of contacts (e.g. Family members, Work colleagues). */
export interface WatchMeContactGroup {
  id: string;
  name: string;
  contacts: WatchMeContact[];
}

function isRelationshipGroupFullySelected(
  group: WatchMeContactGroup,
  selectedIds: Set<string>
): boolean {
  if (group.contacts.length === 0) return false;
  return group.contacts.every((c) => selectedIds.has(c.id));
}

function isRelationshipGroupIndeterminate(
  group: WatchMeContactGroup,
  selectedIds: Set<string>
): boolean {
  let n = 0;
  for (const c of group.contacts) {
    if (selectedIds.has(c.id)) n += 1;
  }
  return n > 0 && n < group.contacts.length;
}

interface WatchMeContactSectionProps {
  groups: WatchMeContactGroup[];
  selectedIds: Set<string>;
  onToggleContact: (id: string) => void;
  /** Selects or clears all contacts in this relationship (multi-group selection). */
  onToggleRelationshipGroup: (groupId: string) => void;
  onAddContactPress: () => void;
  /** Start Watch Me: hide invite pill and dim non–app-user avatars. */
  inviteBadgeMuted?: boolean;
  /** Delay (ms) for section entrance animation. */
  enteringDelay?: number;
}

export function WatchMeContactSection({
  groups,
  selectedIds,
  onToggleContact,
  onToggleRelationshipGroup,
  onAddContactPress,
  inviteBadgeMuted = false,
  enteringDelay = 240,
}: WatchMeContactSectionProps) {
  const { theme } = useAppColorScheme();
  const selectedCount = selectedIds.size;
  let cardDelay = enteringDelay + 40;

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(enteringDelay)}
      className="mt-4 mb-6"
    >
      <View className="flex-row items-center justify-center gap-1 mb-4">
        <AppText className="font-metropolis-bold text-primaryDark dark:text-primaryDark-dark uppercase tracking-wide text-sm">
          Who should watch you?
        </AppText>
        <AppText className="text-captionDark dark:text-captionDark-dark text-sm">
          ({selectedCount} selected)
        </AppText>
      </View>

      <View>
        {groups.map((group) => {
          const fully = isRelationshipGroupFullySelected(group, selectedIds);
          const mixed = isRelationshipGroupIndeterminate(group, selectedIds);
          const checkedState = fully ? true : mixed ? 'mixed' : false;

          return (
            <View key={group.id} className="mb-5">
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => onToggleRelationshipGroup(group.id)}
                className="flex-row items-center gap-3 mb-2 min-h-[44px]"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: checkedState }}
                accessibilityLabel={`${group.name}, select all contacts in this group`}
              >
                <View
                  className="items-center justify-center"
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 3,
                    borderWidth: 1.5,
                    borderColor:
                      fully || mixed ? theme.primaryBlue : theme.avatarBorder,
                    backgroundColor: fully ? theme.primaryBlue : 'transparent',
                  }}
                >
                  {fully ? (
                    <Ionicons name="checkmark" size={11} color="#fff" />
                  ) : mixed ? (
                    <View
                      style={{
                        width: 7,
                        height: 1.5,
                        borderRadius: 0.75,
                        backgroundColor: theme.primaryBlue,
                      }}
                    />
                  ) : null}
                </View>
                <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark text-sm flex-1">
                  {group.name}
                </AppText>
              </TouchableOpacity>
              <View className="flex-row flex-wrap gap-3">
                {group.contacts.map((contact) => (
                  <AppAnimatedView
                    key={contact.id}
                    entering={brandFadeInUp.delay(cardDelay)}
                    style={{
                      flex: 1,
                      minWidth: '45%',
                      maxWidth: '48%',
                      height: CARD_HEIGHT,
                    }}
                  >
                    <WatchMeContactCard
                      contact={contact}
                      selected={selectedIds.has(contact.id)}
                      onPress={() => onToggleContact(contact.id)}
                      inviteBadgeMuted={inviteBadgeMuted}
                    />
                  </AppAnimatedView>
                ))}
              </View>
              {(() => {
                cardDelay += group.contacts.length * 50 + 10;
                return null;
              })()}
            </View>
          );
        })}
      </View>

      <AppAnimatedView entering={brandFadeInUp.delay(cardDelay)}>
        <AppButton
          variant="secondary"
          size="lg"
          className="w-full"
          onPress={onAddContactPress}
        >
          Add contact
        </AppButton>
      </AppAnimatedView>
    </AppAnimatedView>
  );
}
