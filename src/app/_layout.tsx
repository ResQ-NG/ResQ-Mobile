import 'react-native-reanimated';
import '../../global.css';

import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useMetropolisFonts } from '@/hooks/useMetropolisFonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded, error } = useMetropolisFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
