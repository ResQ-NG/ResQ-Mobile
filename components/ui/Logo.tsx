import { StyleSheet, Image, ImageStyle, StyleProp } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'

interface LogoProps {
  style?: StyleProp<ImageStyle>;
}

const Logo = ({ style }: LogoProps) => {
  return (
    <Image
      source={
        useThemeColor({}, 'background') === Colors.light.background
          ? require('@/assets/images/icon-light.png')
          : require('@/assets/images/icon-dark.png')
      }
      style={[styles.logo, style]}
      resizeMode="contain"
    />
  )
}

export default Logo

const styles = StyleSheet.create({
  logo: {
    width: 140,
    height: 120,
    alignSelf: 'center',
    marginBottom: 0
  },
})
