import { View } from 'react-native';
import {
  AppAnimatedView,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import {
  WatchMeContactCard,
  WatchMeViewMoreCard,
  type WatchMeContact,
} from './WatchMeContactCard';

const CARD_HEIGHT = 132;

/** A named group of contacts (e.g. Family members, Work colleagues). */
export interface WatchMeContactGroup {
  id: string;
  name: string;
  contacts: WatchMeContact[];
}

interface WatchMeContactSectionProps {
  groups: WatchMeContactGroup[];
  selectedIds: Set<string>;
  onToggleContact: (id: string) => void;
  onViewMorePress: () => void;
  /** Delay (ms) for section entrance animation. */
  enteringDelay?: number;
}

export function WatchMeContactSection({
  groups,
  selectedIds,
  onToggleContact,
  onViewMorePress,
  enteringDelay = 240,
}: WatchMeContactSectionProps) {
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

      {groups.map((group) => (
        <View key={group.id} className="mb-5">
          <AppText className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark text-sm mb-2">
            {group.name}
          </AppText>
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
                />
              </AppAnimatedView>
            ))}
          </View>
          {(() => {
            cardDelay += group.contacts.length * 50 + 10;
            return null;
          })()}
        </View>
      ))}

      <View className="flex-row flex-wrap gap-3">
        <AppAnimatedView
          entering={brandFadeInUp.delay(cardDelay)}
          style={{
            flex: 1,
            minWidth: '45%',
            maxWidth: '48%',
            height: CARD_HEIGHT,
          }}
        >
          <WatchMeViewMoreCard onPress={onViewMorePress} />
        </AppAnimatedView>
      </View>
    </AppAnimatedView>
  );
}
