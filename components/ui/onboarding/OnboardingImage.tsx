import { View, StyleSheet, DimensionValue } from 'react-native'
import Animated, { useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';


interface IOnboardingImageProps {
    height: DimensionValue;
    OnboardingImageIndex: number;
}
export default function OnboardingImage({ height, OnboardingImageIndex}: IOnboardingImageProps) {
    const OnboardingImages = [
        require("@/assets/images/welcome-1.png"),
        require("@/assets/images/welcome-2.png"),
        require("@/assets/images/welcome-3.png")
    ];

    const imageSource = OnboardingImages[OnboardingImageIndex] ?? OnboardingImages[0];

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withRepeat(
                        withTiming(1.1, { duration: 3000 }),
                        -1,
                        true
                    )
                }
            ]
        };
    });

    return (
        <View style={[styles.container, { height }]}>
            <Animated.Image
                source={imageSource}
                style={[styles.image, animatedStyle]}
                resizeMode="cover"
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    }
  });
