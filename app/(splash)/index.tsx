import { View } from 'react-native'
import React from 'react'
import SplashImage from '@/components/ui/splash/splash-image'

export default function WelcomeSplashScreen() {
  return (
    <View style={{ backgroundColor: "black", flex: 1}}>
        <SplashImage height="65%" src={"@/assets/images/welcome-1.png"} />
    </View>
  )
}
