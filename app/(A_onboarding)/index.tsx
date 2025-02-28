import { View, StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import OnboardingBody from '@/components/ui/onboarding/OnboardingBody';
import OnboardingImage from '@/components/ui/onboarding/OnboardingImage';
import { useRouter } from 'expo-router';
import { useCheckHasCompletedOnboarding } from '@/hooks/useCheckHasCompletedOnboarding';

export default function WelcomeOnboardingScreen() {
    const router = useRouter();
    const { hasCompletedOnboarding } = useCheckHasCompletedOnboarding();

    useEffect(() => {
        if (hasCompletedOnboarding) {
            router.replace('/(auth)');
        }
    }, [hasCompletedOnboarding, router]);

    return (
        <View style={styles.container}>
            <OnboardingImage height="68%" OnboardingImageIndex={0} />
            <OnboardingBody
                headingText="Your Safety, Our Priority"
                bodyText="When seconds matter most, ResQ is there. Our AI-powered emergency response system provides instant help and protection, giving you peace of mind wherever life takes you."
                onContinue={() => router.push('/(A_onboarding)/onboarding-two')}
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
