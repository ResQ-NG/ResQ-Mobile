import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';

interface WatchMeCloseButtonProps {
  onPress: () => void;
}

export function WatchMeCloseButton({ onPress }: WatchMeCloseButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(0)}
      style={{
        position: 'absolute',
        left: 16,
        top: insets.top + 16,
        zIndex: 50,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="w-11 h-11 rounded-full bg-[rgba(18,18,18,0.8)] border border-[rgba(255,255,255,0.18)] items-center justify-center"
      >
        <AppText className="text-white text-xl font-metropolis-bold">✕</AppText>
      </TouchableOpacity>
    </AppAnimatedView>
  );
}
