import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui';

export function SettingsProfileCard() {
  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(60)}
      className="flex-row items-center gap-4 mb-8"
    >
      <Avatar
        size={96}
        altText="MaRia"
        backgroundColor={AVATAR_BACKGROUNDS[2]}
      />
      <View className="flex-1 gap-0.5">
        <AppHeading level={3}>MaRia</AppHeading>
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
