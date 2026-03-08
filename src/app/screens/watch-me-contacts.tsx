import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import {
  WatchMeHeader,
  WatchMeContactSection,
  type WatchMeContactGroup,
} from '@/components/watchme';
import { useAppColorScheme } from '@/theme/colorMode';

const MOCK_GROUPS: WatchMeContactGroup[] = [
  {
    id: 'family',
    name: 'Family members',
    contacts: [
      { id: '1', name: 'Mum', maskedPhone: '0803***4567', avatarBgIndex: 0 },
      { id: '2', name: 'Brother Tunde', maskedPhone: '0701***8901', avatarBgIndex: 1 },
    ],
  },
  {
    id: 'work',
    name: 'Work colleagues',
    contacts: [
      { id: '3', name: 'LizBee', maskedPhone: '0701***8901', avatarBgIndex: 2 },
    ],
  },
];

export default function WatchMeContactsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1', '2']));

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBack = () => router.back();
  const handleContinue = () => {
    router.push('/screens/start-watch-me');
  };

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
      header={
        <WatchMeHeader
          onBack={handleBack}
          title="Watch me contacts"
          subtitle="Set up who can watch your journey"
        />
      }
    >
      <AppAnimatedScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <AppAnimatedView
          entering={brandFadeInUp.delay(80)}
          className="px-4 mb-5"
        >
          <AppText
            variant="body"
            className="text-captionDark dark:text-captionDark-dark leading-6"
          >
            Add and group your trusted contacts. When you start a Watch me session, you’ll choose who can see your live location.
          </AppText>
        </AppAnimatedView>

        <WatchMeContactSection
          groups={MOCK_GROUPS}
          selectedIds={selectedIds}
          onToggleContact={toggleContact}
          onViewMorePress={() => {}}
          enteringDelay={140}
        />
      </AppAnimatedScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 px-4 bg-white dark:bg-black"
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      >
        <AppButton
          onPress={handleContinue}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Continue to Start Watch me
        </AppButton>
      </View>
    </AppAnimatedSafeAreaView>
  );
}
