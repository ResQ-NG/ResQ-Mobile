import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import {
  OnboardingProgressBar,
  OnboardingHero,
  OnboardingFeatureRow,
  OnboardingFooter,
  STEP_1_FEATURES,
  STEP_2_FEATURES,
} from '@/components/onboarding';

export default function OnboardingScreen() {
  const [step, setStep] = useState<1 | 2>(1);
  const progressWidth = useSharedValue('50%');

  const handleContinue = () => {
    if (step === 1) {
      progressWidth.value = withTiming('100%', { duration: 400 });
      setStep(2);
    } else {
      router.replace('/');
    }
  };

  const features = step === 1 ? STEP_1_FEATURES : STEP_2_FEATURES;

  return (
    <AppAnimatedSafeAreaView
      className="flex-1 bg-white"
      edges={['top', 'left', 'right']}
      paddingSize="md"
    >
      <OnboardingProgressBar progressWidth={progressWidth} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <OnboardingHero />
          {features.map((feature, index) => (
            <OnboardingFeatureRow key={feature.title} feature={feature} index={index} />
          ))}
        </View>
      </ScrollView>

      <OnboardingFooter onContinue={handleContinue} />
      <StatusBar style="dark" />
    </AppAnimatedSafeAreaView>
  );
}
