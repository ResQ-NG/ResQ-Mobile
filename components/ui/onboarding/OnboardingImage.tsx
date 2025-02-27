import { View, Image, StyleSheet, DimensionValue } from 'react-native'


interface IOnboardingImageProps {
    height: DimensionValue;
    OnboardingImageIndex: number;
}
export default function OnboardingImage({ height, OnboardingImageIndex}: IOnboardingImageProps) {
    const OnboardingImages = [
        require("@/assets/images/welcome-1.png"),
        require("@/assets/images/welcome-2.png"),
        // require("@/assets/images/welcome-3.png")
    ];

    const imageSource = OnboardingImages[OnboardingImageIndex] ?? OnboardingImages[0];

    return (
        <View style={[styles.container, { height }]}>
            <Image source={imageSource} style={styles.image} resizeMode="cover"/>
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
