import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppButton } from '@/components/ui/AppButton';
import { useAppColorScheme } from '@/theme/colorMode';
import { OnboardingLegal } from './OnboardingLegal';

type OnboardingFooterProps = {
  onContinue: () => void;
  /** Button label; default "Continue" */
  continueLabel?: string;
  /** If true, hide the legal terms link (e.g. for in-modal onboarding). */
  hideLegal?: boolean;
  continueDisabled?: boolean;
  continueLoading?: boolean;
};

export function OnboardingFooter({
  onContinue,
  continueLabel = 'Continue',
  hideLegal = false,
  continueDisabled = false,
  continueLoading = false,
}: OnboardingFooterProps) {
  const { theme } = useAppColorScheme();

  return (
    <View className={`${theme.background} px-6 pt-4`}>
      {!hideLegal && <OnboardingLegal />}
      <AppAnimatedView entering={brandFadeInUp.delay(520)}>
        <AppButton
          variant="primary"
          size="lg"
          className="w-full"
          onPress={onContinue}
          disabled={continueDisabled}
          loading={continueLoading}
        >
          {continueLabel}
        </AppButton>
      </AppAnimatedView>
    </View>
  );
}
