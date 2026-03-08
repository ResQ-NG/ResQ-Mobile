import { View } from 'react-native';
import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppHeading } from '@/components/ui/AppHeading';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { useAppColorScheme } from '@/theme/colorMode';

interface WatchMeHeaderProps {
  onBack?: () => void;
  /** Default: "Watch me" */
  title?: string;
  /** Default: "Let loved ones track your journey" */
  subtitle?: string;
}

export function WatchMeHeader({
  onBack,
  title = 'Watch me',
  subtitle = 'Let loved ones track your journey',
}: WatchMeHeaderProps) {
  const { theme } = useAppColorScheme();

  return (
    <AppAnimatedView entering={brandFadeIn} className="pb-2">
      <View className="py-2">
        <RoundedButton
          onPress={onBack}
          icon={
            <SolarArrowLeftBrokenIcon
              width={20}
              height={20}
              color={theme.textMuted}
            />
          }
          className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
          accessibilityLabel="Go back"
        />
      </View>
      <AppHeading
        level={3}
        className="text-primaryDark dark:text-primaryDark-dark mt-1"
      >
        {title}
      </AppHeading>
      <AppText
        variant="body"
        className="text-captionDark dark:text-captionDark-dark mt-0.5"
      >
        {subtitle}
      </AppText>
    </AppAnimatedView>
  );
}
