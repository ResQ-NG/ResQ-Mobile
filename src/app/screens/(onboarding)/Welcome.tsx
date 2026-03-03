import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppAnimatedView,
  AppAnimatedText,
  brandFadeIn,
  brandFadeInUp,
  brandScaleIn,
} from '@/lib/animation';
import { AppButton } from '@/components/ui/AppButton';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';

const favicon = require('@assets/favicon.png');

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface-light" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-6 pt-8">
        {/* Hero */}
        <View className="items-center pt-4">
          <AppAnimatedView entering={brandScaleIn.delay(0)} className="mb-4">
            <Image
              source={favicon}
              className="h-20 w-20"
              resizeMode="contain"
            />
          </AppAnimatedView>
          <AppAnimatedView entering={brandFadeInUp.delay(80)}>
            <AppHeading level={1} color="primary">
              ResQ
            </AppHeading>
          </AppAnimatedView>
          <AppAnimatedText
            entering={brandFadeIn.delay(160)}
            className="mt-2 text-center font-metropolis-medium text-primary-blue"
          >
            Emergency help, when you need it
          </AppAnimatedText>
        </View>

        {/* Value prop */}
        <AppAnimatedView
          entering={brandFadeInUp.delay(240)}
          className="mt-10 flex-1"
        >
          <AppText variant="body" className="text-center leading-6 text-primaryDark">
            Connect with nearby responders, share your location in an emergency, and get help fast.
          </AppText>
        </AppAnimatedView>

        {/* Actions */}
        <View className="gap-3 pb-2">
          <AppAnimatedView entering={brandFadeInUp.delay(320)}>
            <AppButton
              variant="primary"
              size="lg"
              className="w-full"
              onPress={() => router.replace('/')}
            >
              Get started
            </AppButton>
          </AppAnimatedView>
          <AppAnimatedView entering={brandFadeIn.delay(380)}>
            <AppButton
              variant="ghost"
              size="md"
              className="w-full"
              onPress={() => router.replace('/')}
            >
              Already have an account? Sign in
            </AppButton>
          </AppAnimatedView>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
