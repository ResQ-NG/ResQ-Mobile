import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { FadeIn, FadeInDown, FadeInUp, ZoomIn } from '@/lib/animation';
import { AppAnimatedText } from '@/components/ui/animated/AppAnimatedText';
import { AppAnimatedView } from '@/components/ui/animated/AppAnimatedView';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-surface-light">
      <View className="flex-1 items-center justify-center px-6">
        <AppAnimatedView entering={FadeInUp.duration(400)} className="mb-4">
          <AppHeading level={1} color="primary">
            ResQ
          </AppHeading>
        </AppAnimatedView>

        <AppAnimatedView
          entering={FadeInDown.duration(400).delay(120)}
          className="mb-2"
        >
          <AppText variant="body" className="text-center">
            Welcome to your app.
          </AppText>
        </AppAnimatedView>

        <AppAnimatedText
          entering={FadeIn.duration(400).delay(220)}
          className="font-metropolis-regular text-sm text-captionDark text-center"
        >
          Built with Metropolis, NativeWind & Zustand.
        </AppAnimatedText>

        <AppAnimatedView
          entering={ZoomIn.duration(500).delay(320)}
          className="mt-8 rounded-xl bg-primary-blue px-6 py-3"
        >
          <AppText
            variant="body"
            className="text-center font-metropolis-semibold text-white"
          >
            Animated view + base text
          </AppText>
        </AppAnimatedView>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}
