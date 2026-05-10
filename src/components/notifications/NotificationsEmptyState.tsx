import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import LottieView from 'lottie-react-native';

export function NotificationsEmptyState() {
  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(120)}
      className="items-center pt-12 px-6"
    >
      <LottieView
        source={require('@assets/lottie/empty.json')}
        autoPlay
        loop={false}
        style={{ width: 300, height: 300 }}
      />
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
