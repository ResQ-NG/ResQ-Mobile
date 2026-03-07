import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import LottieView from 'lottie-react-native';

export function ReportsEmptyState() {
  const title = 'No reports yet';
  const subtitle =
    'Your emergency reports will appear here. Use the main tab to record and submit incidents.';

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(120)}
      className="items-center pt-12 px-6"
    >
      <View className="items-center justify-center mb-4">
        <LottieView
          source={require('../../../assets/lottie/empty.json')}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
      <AppHeading
        level={4}
        className="text-center text-primaryDark dark:text-primaryDark-dark"
      >
        {title}
      </AppHeading>
      <AppText
        variant="caption"
        className="text-center mt-2 text-captionDark dark:text-captionDark-dark max-w-[280px]"
      >
        {subtitle}
      </AppText>
    </AppAnimatedView>
  );
}
