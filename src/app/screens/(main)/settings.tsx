import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedSafeAreaView, AppAnimatedScrollView } from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsProfileCard } from '@/components/settings/SettingsProfileCard';
import { SettingsList } from '@/components/settings/SettingsList';

export default function SettingsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      header={<SettingsHeader />}
    >
      <AppAnimatedScrollView
        className="flex-1 px-6 pt-8"
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileCard />
        <SettingsList />
      </AppAnimatedScrollView>
    </AppAnimatedSafeAreaView>
  );
}
