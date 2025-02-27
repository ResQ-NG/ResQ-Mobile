import { View, Image, StyleSheet, DimensionValue } from 'react-native'


interface ISplashImageProps {
    height: DimensionValue;
    splashImageIndex: number;
}
export default function SplashImage({ height, splashImageIndex}: ISplashImageProps) {
    const splashImages = [
        require("@/assets/images/welcome-1.png"),
        // require("@/assets/images/welcome-2.png"),
        // require("@/assets/images/welcome-3.png")
    ];

    const imageSource = splashImages[splashImageIndex] ?? splashImages[0];

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
