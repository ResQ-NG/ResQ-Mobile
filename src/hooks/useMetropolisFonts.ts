import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';

import { metropolisFonts } from '../theme/fonts';

SplashScreen.preventAutoHideAsync();

export function useMetropolisFonts() {
  const [loaded, error] = useFonts(metropolisFonts);

  const onLayoutRootView = useCallback(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  return { loaded: !!loaded, error };
}
