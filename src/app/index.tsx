import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Image, View } from 'react-native';
import {
  brandFadeIn,
  brandFadeInDown,
  brandFadeInUp,
  brandScaleIn,
} from '@/lib/animation';
import { AppButton } from '@/components/ui/AppButton';
import { AppAnimatedText } from '@/components/ui/animated/AppAnimatedText';
import { AppAnimatedView } from '@/components/ui/animated/AppAnimatedView';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';

const favicon = require('@assets/favicon.png');

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-surface-light">
      <View className="flex-1 items-center justify-center px-6">
        <AppAnimatedView entering={brandScaleIn.delay(0)} className="mb-4">
          <Image source={favicon} className="h-32 w-32" resizeMode="contain" />
        </AppAnimatedView>
        <AppAnimatedView entering={brandFadeInUp.delay(60)} className="mb-4">
          <AppHeading level={1} color="primary">
            ResQ
          </AppHeading>
        </AppAnimatedView>

        <AppAnimatedView
          entering={brandFadeInDown.delay(120)}
          className="mb-2"
        >
          <AppText variant="body" className="text-center">
            Welcome to your app.
          </AppText>
        </AppAnimatedView>

        <AppAnimatedText
          entering={brandFadeIn.delay(200)}
          className="font-metropolis-regular text-sm text-captionDark text-center"
        >
          Built with Metropolis, NativeWind & Zustand.
        </AppAnimatedText>

        <AppAnimatedView entering={brandFadeInUp.delay(280)} className="mt-8 w-full max-w-xs">
          <AppButton
            variant="primary"
            size="lg"
            onPress={() => router.push('/screens/Welcome')}
          >
            See onboarding
          </AppButton>
        </AppAnimatedView>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}
