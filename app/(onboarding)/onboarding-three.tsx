import { View, StyleSheet} from 'react-native'
import React from 'react'
import OnboardingBody from '@/components/ui/onboarding/OnboardingBody';
import OnboardingImage from '@/components/ui/onboarding/OnboardingImage';


export default function OnboardingThreeScreen() {
  return (
    <View style={styles.container}>
        <OnboardingImage height="68%" OnboardingImageIndex={2} />
        <OnboardingBody
            headingText="Your Voice. Your Safety. Your Power"
            bodyText="No one should feel helpless. No one should be unheard. ResQ is more than an app—it’s a movement to make safety accessible for everyone."

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
