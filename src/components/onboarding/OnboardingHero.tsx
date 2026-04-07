import { Image } from 'react-native';
import { AppAnimatedView, brandFadeInUp, brandScaleIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';

const appLogo = require('@assets/applogo-without-bg.png');

type OnboardingHeroProps = {
  /** When false, only the logo is shown (e.g. Get started). */
  showTitle?: boolean;
};

export function OnboardingHero({ showTitle = true }: OnboardingHeroProps) {
  return (
    <>
      <AppAnimatedView
        entering={brandScaleIn.delay(0)}
        className={showTitle ? 'mb-4 items-center' : 'mb-6 items-center'}
      >
        <Image source={appLogo} className="h-16 w-16" resizeMode="contain" />
      </AppAnimatedView>
      {showTitle ? (
        <AppAnimatedView entering={brandFadeInUp.delay(80)} className="mb-8">
          <AppHeading level={1} color="default" className="text-center">
            Welcome to the ResQ
          </AppHeading>
        </AppAnimatedView>
      ) : null}
    </>
  );
}
