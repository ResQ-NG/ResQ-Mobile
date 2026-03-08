import LottieView from 'lottie-react-native';
import { AppAnimatedView, brandFadeInUp, brandScaleIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';

export function WatchMeOnboardingHero() {
  return (
    <>
      <AppAnimatedView entering={brandScaleIn.delay(0)} className="mb-4 items-center">
        <LottieView
          source={require('@assets/lottie/watch-me.json')}
          autoPlay
          loop
          style={{ width: 200, height: 160 }}
        />
      </AppAnimatedView>
      <AppAnimatedView entering={brandFadeInUp.delay(80)} className="mb-8">
        <AppHeading level={1} color="default" className="text-center">
          Watch me
        </AppHeading>
        <AppText
          variant="body"
          className="text-captionDark dark:text-captionDark-dark text-center mt-2 max-w-[320px] mx-auto"
        >
          Share your journey with people who care
        </AppText>
      </AppAnimatedView>
    </>
  );
}
