import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';

export function SettingsProfileCard() {
  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(60)}
      className="flex-row items-center gap-4 mb-8"
    >
      <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)] bg-surface-light dark:bg-surface-dark" />
      <View className="flex-1 gap-0.5">
        <AppHeading level={2}>MaRia</AppHeading>
        <AppText
          variant="body"
          className="text-captionDark dark:text-captionDark-dark text-sm"
        >
          maria@gmail.com
        </AppText>
        <View className="mt-1.5 self-start px-3 py-1.5 rounded-full bg-surface-light dark:bg-surface-dark">
          <AppText variant="caption" className="text-xs">
            Member since Jan 2025
          </AppText>
        </View>
      </View>
    </AppAnimatedView>
  );
}
