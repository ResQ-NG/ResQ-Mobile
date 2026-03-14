import Animated from 'react-native-reanimated';
import { useShakeAttention } from '@/hooks/useShakeAttention';

/** Wrapper that runs a subtle horizontal shake to draw attention. Pass delayMs so multiple instances don't sync. */
export function AttentionShake({
  children,
  delayMs = 0,
}: {
  children: React.ReactNode;
  delayMs?: number;
}) {
  const style = useShakeAttention({ delayMs });
  return <Animated.View style={style}>{children}</Animated.View>;
}
