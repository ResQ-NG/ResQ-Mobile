import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import { AppAnimatedSafeAreaView } from '@/lib/animation';

const LOGO_SIZE = 126;

export default function LoadingLogoLottie({
  onSplashScreenAnimationFinished,
}: {
  onSplashScreenAnimationFinished: () => void;
}) {
  return (
    <AppAnimatedSafeAreaView
      className="flex-1 items-center justify-center bg-white dark:bg-black"
      edges={[]}
    >
      <View style={styles.container}>
        <LottieView
          source={require('@assets/lottie/logo.json')}
          autoPlay
          loop={false}
          onAnimationFinish={(isFinished) => {
            if (!isFinished) {
              onSplashScreenAnimationFinished();
            }
          }}
          style={styles.lottie}
        />
      </View>
    </AppAnimatedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  lottie: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
