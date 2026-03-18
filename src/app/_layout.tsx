import 'react-native-reanimated';
import '../../global.css';

import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useMetropolisFonts } from '@/hooks/useMetropolisFonts';
import { debugAppConfig } from '@/lib/app-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { setupOnlineManager } from '@/lib/utils/react-query/onlineManager';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StatusBar } from 'expo-status-bar';
import { useFocusManager } from '@/lib/utils/react-query/focusManager';
import { useWatchMeSessionBanner } from '@/hooks/useWatchMeSessionBanner';
import { useSosBanner } from '@/hooks/useSosBanner';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheetRegistry from './(bottom-sheets)/registry';
import { AppBannerHost } from '@/components/app-banner/AppBannerHost';
import { AppToastHost } from '@/components/app-toast/AppToastHost';
import { AppModalHost } from '@/components/app-modal/AppModalHost';
import { InCallHost } from '@/components/in-call';
import { registerGlobals } from '@livekit/react-native';

registerGlobals();
// We use only react-native-safe-area-context; this warning comes from a dependency.
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.",
]);

debugAppConfig();
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function ThemeAwareStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  const { loaded, error } = useMetropolisFonts();
  useFocusManager();
  useWatchMeSessionBanner();
  useSosBanner();

  useEffect(() => {
    setupOnlineManager();
  }, []);

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ThemeAwareStatusBar />
          <BottomSheetModalProvider>
            <QueryClientProvider client={queryClient}>
              <KeyboardProvider>
                <AppBannerHost />
                <AppToastHost />
                <AppModalHost />
                <InCallHost />
                <BottomSheetRegistry />
                <Stack screenOptions={{ headerShown: false }} />
              </KeyboardProvider>
            </QueryClientProvider>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
