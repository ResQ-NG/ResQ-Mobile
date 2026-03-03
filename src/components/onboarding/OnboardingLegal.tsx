import { Linking } from 'react-native';
import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';

const TERMS_URL = 'https://example.com/terms';
const PRIVACY_URL = 'https://example.com/privacy';

export function OnboardingLegal() {
  return (
    <AppAnimatedView entering={brandFadeIn.delay(480)} className="mb-4">
      <AppText variant="caption" className="text-center text-sm">
        By using ResQ&apos;s app, you agree to our{' '}
        <AppText
          variant="caption"
          className="font-metropolis-medium text-primary-blue"
          onPress={() => Linking.openURL(TERMS_URL)}
        >
          Terms of use
        </AppText>
        {' and '}
        <AppText
          variant="caption"
          className="font-metropolis-medium text-primary-blue"
          onPress={() => Linking.openURL(PRIVACY_URL)}
        >
          privacy policy
        </AppText>
        .
      </AppText>
    </AppAnimatedView>
  );
}
