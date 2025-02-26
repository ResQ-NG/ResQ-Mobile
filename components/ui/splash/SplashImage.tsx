import { View, Image, StyleSheet, DimensionValue } from 'react-native'


interface ISplashImageProps {
    height: DimensionValue;
    src: string;
}
export default function SplashImage({ height, src}: ISplashImageProps) {
  return (
    <View style={[styles.container, { height }]}>
        <Image source={require("@/assets/images/welcome-1.png")} style={styles.image} resizeMode="cover"/>
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
