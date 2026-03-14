import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppText } from '@/components/ui/AppText';
import { useCheckingSafetySheetStore } from '@/stores/checking-safety-sheet-store';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarShieldCheckBoldIcon from '@/components/icons/solar/shield-check-bold';

const RING_SIZE = 96;
const RING_STROKE = 8;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;
const START_FROM_TOP = CIRCUMFERENCE / 4;

export default function CheckingSafetyBottomSheet() {
  const { isOpen, progress, message, hide } = useCheckingSafetySheetStore();
  const { theme } = useAppColorScheme();

  const progressLength = (progress / 100) * CIRCUMFERENCE;

  return (
    <BaseBottomSheet
      snapPoints={['38%']}
      initialIndex={0}
      isOpen={isOpen}
      onClose={hide}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      showHeader={false}
      contentPadding={{ horizontal: 24, top: 8, bottom: 28 }}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.primaryBlue + '18' },
          ]}
        >
          <SolarShieldCheckBoldIcon
            width={40}
            height={40}
            color={theme.primaryBlue}
          />
        </View>

        <AppText
          className="text-lg font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark text-center mt-4"
          numberOfLines={1}
        >
          Checking your safety
        </AppText>

        <View style={styles.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE} style={styles.svg}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              stroke={theme.avatarBorder}
              strokeWidth={RING_STROKE}
              fill="transparent"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              stroke={theme.primaryBlue}
              strokeWidth={RING_STROKE}
              fill="transparent"
              strokeDasharray={`${progressLength} ${CIRCUMFERENCE}`}
              strokeDashoffset={START_FROM_TOP}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.percentWrap}>
            <AppText className="text-xl font-metropolis-bold text-primaryDark dark:text-primaryDark-dark">
              {Math.round(progress)}%
            </AppText>
          </View>
        </View>

        <AppText
          className="text-sm font-metropolis-regular text-captionDark dark:text-captionDark-dark text-center mt-3"
          numberOfLines={2}
        >
          {message}
        </AppText>
      </View>
    </BaseBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrap: {
    position: 'relative',
    marginTop: 20,
  },
  svg: {
    alignSelf: 'center',
  },
  percentWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
