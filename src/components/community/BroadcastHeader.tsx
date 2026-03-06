import { useColorScheme } from 'react-native';
import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { RoundedButton } from '@/components/ui/RoundedButton';
import MingcuteSearchLineIcon from '@/components/icons/mingcute/search-line';

interface BroadcastHeaderProps {
  onSearchPress?: () => void;
}

export function BroadcastHeader({ onSearchPress }: BroadcastHeaderProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <AppAnimatedView
      entering={brandFadeIn}
      className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black"
    >

      <AppHeading level={4} className="text-primaryDark dark:text-primaryDark-dark">
        Broadcast
      </AppHeading>

      <RoundedButton
        onPress={onSearchPress}
        icon={
          <MingcuteSearchLineIcon
            width={20}
            height={20}
            color={isDark ? '#A3A3A3' : '#6b7280'}
          />
        }
        className="bg-surface-light dark:bg-surface-dark"
        accessibilityLabel="Search broadcasts"
      />
    </AppAnimatedView>
  );
}
