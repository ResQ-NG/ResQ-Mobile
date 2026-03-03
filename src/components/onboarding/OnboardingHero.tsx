import { Image } from 'react-native';
import { AppAnimatedView, brandFadeInUp, brandScaleIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';

const appLogo = require('@assets/applogo-without-bg.png');

export function OnboardingHero() {
  return (
    <>
      <AppAnimatedView entering={brandScaleIn.delay(0)} className="mb-4 items-center">
        <Image source={appLogo} className="h-16 w-16" resizeMode="contain" />
      </AppAnimatedView>
      <AppAnimatedView entering={brandFadeInUp.delay(80)} className="mb-8">
        <AppHeading level={1} color="default" className="text-center">
          Welcome to the ResQ
        </AppHeading>
      </AppAnimatedView>
    </>
  );
}
