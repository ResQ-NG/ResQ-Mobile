import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppButton } from '@/components/ui/AppButton';
import { OnboardingLegal } from './OnboardingLegal';

type OnboardingFooterProps = {
  onContinue: () => void;
};

export function OnboardingFooter({ onContinue }: OnboardingFooterProps) {
  return (
    <View className="bg-white px-6 pb-6 pt-4">
      <OnboardingLegal />
      <AppAnimatedView entering={brandFadeInUp.delay(520)}>
        <AppButton variant="primary" size="lg" className="w-full" onPress={onContinue}>
          Continue
        </AppButton>
      </AppAnimatedView>
    </View>
  );
}
