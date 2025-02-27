import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';



interface IOnboardingBody {
    headingText: string;
    bodyText: string;
    onContinue?: () => void;
}

export default function OnboardingBody(
    {headingText, bodyText, onContinue} :IOnboardingBody
) {
  return (
    <View style={styles.splashBox}>
        <Text style={styles.headingText}>{headingText}</Text>
        <Text style={styles.paragraphText}>
            {bodyText}
        </Text>
        <Button
            title="Continue"
            style={{marginTop: 10}}
            fullWidth
            onPress={onContinue}
        />
    </View>
  )
}


const styles = StyleSheet.create({
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
