import { Image } from 'react-native';
import { AppAnimatedView, brandFadeInUp, brandScaleIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';

const appLogo = require('@assets/applogo-without-bg.png');

type OnboardingHeroProps = {
  /** When false, only the logo is shown (e.g. Get started). */
  showTitle?: boolean;
  /** Tailwind size classes for the logo (default `h-16 w-16`). */
  logoClassName?: string;
};

export function OnboardingHero({
  showTitle = true,
  logoClassName = 'h-16 w-16',
}: OnboardingHeroProps) {
  return (
    <>
      <AppAnimatedView
        entering={brandScaleIn.delay(0)}
        className={showTitle ? 'mb-4 items-center' : 'mb-6 items-center'}
      >
        <Image
          source={appLogo}
          className={logoClassName}
          resizeMode="contain"
          accessibilityLabel="ResQ logo"
        />
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
