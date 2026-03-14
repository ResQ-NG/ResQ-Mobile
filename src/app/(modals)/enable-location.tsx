import { Linking, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { AppText } from '@/components/ui/AppText';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppButton } from '@/components/ui/AppButton';
import { RoundedButton } from '@/components/ui/RoundedButton';
import { useLocationStore } from '@/stores/location-store';
import { useAppColorScheme } from '@/theme/colorMode';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeIn,
  brandFadeInUp,
  brandScaleIn,
} from '@/lib/animation';
import LottieView from 'lottie-react-native';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

export default function EnableLocationScreen() {
  const { theme } = useAppColorScheme();
  const setLocationModalVisible = useLocationStore(
    (s) => s.setLocationModalVisible
  );

  const handleDismiss = usePreventDoublePress(() => {
    setLocationModalVisible(false);
    router.back();
  });

  const handleRequestPermission = usePreventDoublePress(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setLocationModalVisible(false);
      router.back();
    }
  });

  const handleOpenSettings = usePreventDoublePress(() => {
    Linking.openSettings();
  });

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="md"
      header={
        <AppAnimatedView
          entering={brandFadeIn}
          className="flex-row items-center justify-between"
        >
          <RoundedButton
            onPress={handleDismiss}
            icon={
              <SolarArrowLeftBrokenIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
            className="bg-surface-light dark:bg-surface-dark"
            accessibilityLabel="Go back"
          />
          <AppHeading level={4}>Location access</AppHeading>
          <View className="w-12 h-12" />
        </AppAnimatedView>
      }
    >
      <AppAnimatedScrollView className="flex-1 pt-8 pb-6">
        {/* Icon + heading + description */}
        <AppAnimatedView
          entering={brandScaleIn.delay(80)}
          className="items-center mb-10"
        >
          <View className="rounded-full items-center justify-center mb-6 ">
            <LottieView
              source={require('../../../assets/lottie/globe.json')}
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
          </View>
          <AppHeading level={3} className="text-center mb-3">
            Enable location
          </AppHeading>
          <AppText variant="caption" className="text-center leading-5">
            ResQ uses your location to show your position on the map, share it
            in emergency reports, and help responders find you quickly.
          </AppText>
        </AppAnimatedView>

        {/* Action buttons */}
        <AppAnimatedView entering={brandFadeInUp.delay(160)} className="gap-3">
          <AppButton
            variant="primary"
            size="lg"
            onPress={handleRequestPermission}
            className="w-full"
          >
            Allow location access
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            onPress={handleOpenSettings}
            className="w-full"
          >
            Open settings
          </AppButton>
        </AppAnimatedView>

        <AppAnimatedView entering={brandFadeInUp.delay(240)}>
          <AppText variant="caption" className="text-center mt-6 text-xs">
            You can change this later in your device settings.
          </AppText>
        </AppAnimatedView>
      </AppAnimatedScrollView>
    </AppAnimatedSafeAreaView>
  );
}
