import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { useAppColorScheme } from '@/theme/colorMode';

export function NotificationsHeader() {
  const { theme } = useAppColorScheme();
  const navigation = useNavigation();
  return (
    <AppAnimatedView
      entering={brandFadeIn}
      className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black"
    >
      <RoundedButton
        onPress={() => {
          if (navigation.canGoBack()) {
            router.back();
          } else {
            router.replace('/screens/main');
          }
        }}
        icon={
          <SolarArrowLeftBrokenIcon width={20} height={20} color={theme.textMuted} />
        }
        className="bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]"
        accessibilityLabel="Go back"
      />
      <AppHeading level={4}>Notifications</AppHeading>
      {/* Spacer keeps heading centred */}
      <AppAnimatedView className="w-12 h-12" />
    </AppAnimatedView>
  );
}

