import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppButton } from '@/components/ui/AppButton';
import { useAppColorScheme } from '@/theme/colorMode';
import { OnboardingLegal } from './OnboardingLegal';

type OnboardingFooterProps = {
  onContinue: () => void;
};

export function OnboardingFooter({ onContinue }: OnboardingFooterProps) {
  const { theme } = useAppColorScheme();

  return (
    <View className={`${theme.background} px-6 pb-6 pt-4`}>
      <OnboardingLegal />
      <AppAnimatedView entering={brandFadeInUp.delay(520)}>
        <AppButton variant="primary" size="lg" className="w-full" onPress={onContinue}>
          Continue
        </AppButton>
      </AppAnimatedView>
    </View>
  );
}
