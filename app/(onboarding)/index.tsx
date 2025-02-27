import { View, StyleSheet} from 'react-native'
import React from 'react'
import OnboardingBody from '@/components/ui/onboarding/OnboardingBody';
import OnboardingImage from '@/components/ui/onboarding/OnboardingImage';
import { useRouter } from 'expo-router';

export default function WelcomeOnboardingScreen() {
    const router = useRouter();

  return (
    <View style={styles.container}>
        <OnboardingImage height="68%" OnboardingImageIndex={0} />
        <OnboardingBody
            headingText="Your Safety, Our Priority"
            bodyText="When seconds matter most, ResQ is there. Our AI-powered emergency response system provides instant help and protection, giving you peace of mind wherever life takes you."
            onContinue={() => router.push('/onboarding-two')}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
         backgroundColor: "black",
          flex: 1
    },
  });
