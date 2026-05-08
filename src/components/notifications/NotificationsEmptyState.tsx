import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import SolarBellBingBoldIcon from '@/components/icons/solar/bell-bing-bold';

export function NotificationsEmptyState() {
  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(120)}
      className="items-center pt-12 px-6"
    >
      <View className="w-16 h-16 rounded-full bg-surface-light dark:bg-surface-dark items-center justify-center border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]">
        <SolarBellBingBoldIcon width={26} height={26} color="#6b7280" />
      </View>
      <AppHeading
        level={4}
        className="text-center text-primaryDark dark:text-primaryDark-dark mt-4"
      >
        No notifications yet
      </AppHeading>
      <AppText
        variant="caption"
        className="text-center mt-2 text-captionDark dark:text-captionDark-dark max-w-[280px]"
      >
        Updates about your reports, contacts, and Watch Me will appear here.
      </AppText>
    </AppAnimatedView>
  );
}

