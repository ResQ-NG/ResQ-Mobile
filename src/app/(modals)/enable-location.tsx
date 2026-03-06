import { View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppButton } from '@/components/ui/AppButton';
import { useLocationStore } from '@/stores/location-store';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import HugeiconsArrowRight01Icon from '@/components/icons/hugeicons/arrow-right-01';

export default function EnableLocationScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const setLocationModalVisible = useLocationStore((s) => s.setLocationModalVisible);
  const iconColor = colorScheme === 'dark' ? '#E5E5E5' : '#222222';

  const handleDismiss = () => {
    setLocationModalVisible(false);
    router.back();
  };

  const handleRequestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setLocationModalVisible(false);
      router.back();
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <View
      className="flex-1 bg-white dark:bg-black"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
      {/* Header with close */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]">
        <View className="w-12 h-12" />
        <AppHeading level={4} className="text-primaryDark dark:text-primaryDark-dark">
          Location access
        </AppHeading>
        <RoundedButton
          onPress={handleDismiss}
          icon={
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <HugeiconsArrowRight01Icon width={20} height={20} color={iconColor} />
            </View>
          }
          className="bg-surface-light dark:bg-surface-dark"
          accessibilityLabel="Close"
        />
      </View>

      <View className="flex-1 px-6 pt-8 pb-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary-blue/10 dark:bg-primary-blue-dark/20 items-center justify-center mb-6">
            <SolarMapPointBoldIcon width={40} height={40} color="#0000FF" />
          </View>
          <AppHeading level={3} className="text-center text-primaryDark dark:text-primaryDark-dark mb-2">
            Enable location
          </AppHeading>
          <AppText
            variant="caption"
            className="text-center text-captionDark dark:text-captionDark-dark"
          >
            ResQ uses your location to show your position on the map, share it in
            emergency reports, and help responders find you quickly.
          </AppText>
        </View>

        <View className="gap-3">
          <AppButton
            variant="primary"
            size="lg"
            onPress={handleRequestPermission}
            className="w-full"
          >
            Allow location access
          </AppButton>
          <AppButton
            variant="outline"
            size="lg"
            onPress={handleOpenSettings}
            className="w-full"
          >
            Open settings
          </AppButton>
        </View>

        <AppText
          variant="caption"
          className="text-center mt-6 text-captionDark dark:text-captionDark-dark text-xs"
        >
          You can change this later in your device settings.
        </AppText>
      </View>
    </View>
  );
}
