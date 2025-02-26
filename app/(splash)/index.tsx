import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import SplashImage from '@/components/ui/splash/SplashImage'
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';

export default function WelcomeSplashScreen() {
  return (
    <View style={styles.container}>
        <SplashImage height="68%" src={"@/assets/images/welcome-1.png"} />
        <View style={styles.splashBox}>
            <Text style={styles.headingText}>Your Guardian In Crisis</Text>
            <Text style={styles.paragraphText}>We swiftly connect you to emergency services, providing immediate aid and support when you need it most – because every second counts.
            </Text>
            <Button title="Continue" style={{marginTop: 10}} fullWidth/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
         backgroundColor: "black",
          flex: 1
    },
    splashBox: {
        height: "35%",
        backgroundColor: "black",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        marginTop: -40,
        paddingTop: 30,
        alignItems: "center",
        gap: 25,
        paddingRight: 20,
        paddingLeft: 20
    },
    headingText: {
        ...Typography.h1,
        color: Colors.brandConstants.primaryWhite,
        fontWeight: "bold"
    },
    paragraphText: {
            ...Typography.paragraph,
            color: Colors.brandConstants.primaryDullGray,
            fontWeight: "normal",
            textAlign: "center"
        }

  });
