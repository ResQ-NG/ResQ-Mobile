import { useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { AppAnimatedView, brandFadeInUp, brandFadeIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import SolarBellBoldIcon from '@/components/icons/solar/bell-bold';

const BROADCAST_IMAGE = require('@assets/broadcast.png');

const TOTAL_PILLS = 12;
const RING_RADIUS = 78;
const PILL_WIDTH = 20;
const PILL_HEIGHT = 5;
const RING_SIZE = (RING_RADIUS + PILL_WIDTH) * 2;

interface BroadcastHeroProps {
  /** Number of unseen broadcasts (green pills + badge number) */
  badgeCount?: number;
  /** Total number of broadcast slots to show; rest are grey (seen) */
  totalCount?: number;
}

function pillPosition(index: number, total: number) {
  const angleRad = (index * 2 * Math.PI) / total - Math.PI / 2;
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;
  // Pills tangent to the ring (along the circle); radial would be rotateDeg without +90
  const rotateDeg = (angleRad * 180) / Math.PI + 90;
  return {
    left: cx + RING_RADIUS * Math.cos(angleRad) - PILL_WIDTH / 2,
    top: cy + RING_RADIUS * Math.sin(angleRad) - PILL_HEIGHT / 2,
    rotateDeg,
  };
}

/** Single status pill with optional pulse animation for unseen (green) state */
function StatusPill({
  left,
  top,
  rotateDeg,
  backgroundColor,
  isUnseen,
}: {
  left: number;
  top: number;
  rotateDeg: number;
  backgroundColor: string;
  isUnseen: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isUnseen) {
      scale.value = withRepeat(
        withTiming(1.3, { duration: 800 }),
        -1,
        true
      );
    }
    // scale is a Reanimated shared value (stable ref), not a dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnseen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateDeg}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.pill,
        { left, top, backgroundColor },
        animatedStyle,
      ]}
    />
  );
}

/** Notification bell with a repeating shake animation */
function ShakingBell() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(0, { duration: 80 })
      ),
      -1,
      false
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <SolarBellBoldIcon width={20} height={20} color="#F00033" />
    </Animated.View>
  );
}

export function BroadcastHero({
  badgeCount = 0,
  totalCount = TOTAL_PILLS,
}: BroadcastHeroProps) {
  const unseenCount = Math.min(badgeCount, totalCount);
  const seenCount = totalCount - unseenCount;

  return (
    <>
      <AppAnimatedView
        entering={brandFadeInUp.delay(120)}
        className="items-center px-6 mt-20 pb-4"
      >
        <View style={styles.imageWrapper}>
          {/* Status ring: grey = seen, green = unseen (pills) */}
          <View style={styles.ring} pointerEvents="none">
            {Array.from({ length: totalCount }, (_, i) => {
              const isUnseen = i >= seenCount;
              const pos = pillPosition(i, totalCount);
              return (
                <AppAnimatedView
                  key={i}
                  entering={brandFadeIn.delay(160 + i * 45)}
                  style={StyleSheet.absoluteFill}
                >
                  <StatusPill
                    left={pos.left}
                    top={pos.top}
                    rotateDeg={pos.rotateDeg}
                    backgroundColor={isUnseen ? '#17A34A' : '#9ca3af'}
                    isUnseen={isUnseen}
                  />
                </AppAnimatedView>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => {}} activeOpacity={0.7} className="w-[140] h-[140] rounded-full overflow-hidden bg-surface-light dark:bg-surface-dark">
            <Image
              source={BROADCAST_IMAGE}
              resizeMode="cover"
              className="w-full h-full"
            />
          </TouchableOpacity>

          {badgeCount > 0 && (
            <View className="absolute top-3 items-center right-[25px] w-10 h-10 rounded-full bg-accent-red dark:bg-accent-red-dark justify-center">
              <AppText className="text-white font-metropolis-bold text-sm">
                {badgeCount}
              </AppText>
            </View>
          )}
        </View>

        <AppHeading
          level={4}
          className="text-center mt-4 text-primaryDark dark:text-primaryDark-dark"
        >
          Official broadcasts
        </AppHeading>
        <AppText
          variant="caption"
          className="text-center mt-2 text-captionDark dark:text-captionDark-dark px-4"
        >
          Updates from verified authorities. Get updates from police, FRSC,
          and emergency services
        </AppText>
      </AppAnimatedView>

      {badgeCount > 0 && (
        <AppAnimatedView
          entering={brandFadeInUp.delay(180)}
          className="flex-row items-center justify-center gap-2 py-4"
        >
          <ShakingBell />
          <AppText className="font-metropolis-bold text-accent-red dark:text-accent-red-dark text-sm">
            {badgeCount} NEW BROADCAST
          </AppText>
        </AppAnimatedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    position: 'relative',
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    left: 0,
    top: 0,
  },
  pill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
  },
});
