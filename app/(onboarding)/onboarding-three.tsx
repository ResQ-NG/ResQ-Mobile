import { View, StyleSheet} from 'react-native'
import React from 'react'
import OnboardingBody from '@/components/ui/onboarding/OnboardingBody';
import OnboardingImage from '@/components/ui/onboarding/OnboardingImage';


export default function OnboardingThreeScreen() {
  return (
    <View style={styles.container}>
        <OnboardingImage height="68%" OnboardingImageIndex={2} />
        <OnboardingBody
            headingText="Building a safer world, one incident at a time"
            bodyText="We swiftly connect you to emergency services, providing immediate aid and support when you need it most – because every second counts."

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
