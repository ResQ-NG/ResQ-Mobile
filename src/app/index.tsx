import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import LoadingLogoLottie from '@/components/startup/LoadingLogoLottie';
import { useMetropolisFonts } from '@/hooks/useMetropolisFonts';

export default function Index() {
  const { loaded, error } = useMetropolisFonts();
  const [splashScreenAnimationFinished, setSplashScreenAnimationFinished] =
    useState(false);

  const isAppReady = loaded || error;

  useEffect(() => {
    if (isAppReady && splashScreenAnimationFinished) {
      router.replace('/screens/main');
    }
  }, [isAppReady, splashScreenAnimationFinished]);

  return (
    <LoadingLogoLottie
      onSplashScreenAnimationFinished={() =>
        setSplashScreenAnimationFinished(true)
      }
    />
  );
}
