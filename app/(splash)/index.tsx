import { View, StyleSheet} from 'react-native'
import React from 'react'
import SplashImage from '@/components/ui/splash/SplashImage'
import SplashBody from '@/components/ui/splash/SplashBody';

export default function WelcomeSplashScreen() {
  return (
    <View style={styles.container}>
        <SplashImage height="68%" splashImageIndex={0} />
        <SplashBody
            headingText="Your Guardian In Crisis"
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
