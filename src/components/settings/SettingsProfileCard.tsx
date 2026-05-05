import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui';
import { SettingsProfileCardSkeleton } from '@/components/settings/SettingsProfileCardSkeleton';
import { useCurrentUserProfileAvatar } from '@/hooks/useCurrentUserProfileAvatar';
import { formatAuthProfileMemberSinceLabel } from '@/network/modules/auth/utils';
import { useAppColorScheme } from '@/theme/colorMode';

export function SettingsProfileCard() {
  const { theme } = useAppColorScheme();
  const {
    data: profile,
    isPending,
    isError,
    avatarUri,
    displayName,
  } = useCurrentUserProfileAvatar();

  const showSkeleton = isPending && !profile;
  const name = profile ? displayName : '—';
  const email = profile?.email ?? '—';
  const memberLine = profile?.created_at
    ? formatAuthProfileMemberSinceLabel(profile.created_at)
    : null;

  if (showSkeleton) {
    return <SettingsProfileCardSkeleton />;
  }

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(60)}
      className="mb-8 flex-row items-center gap-4"
    >
      <View className="relative h-24 w-24">
        <View className="h-24 w-24 overflow-hidden rounded-full">
          <Avatar
            size={96}
            altText={name}
            backgroundColor={AVATAR_BACKGROUNDS[2]}
            source={avatarUri ? { uri: avatarUri } : undefined}
          />
        </View>
        <View
          pointerEvents="none"
          className="absolute bottom-0 right-0 h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-white bg-primary-blue dark:border-neutral-950 dark:bg-primary-blue-dark"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Ionicons
            name="pencil"
            size={15}
            color={theme.iconOnAccent}
          />
        </View>
      </View>
      <View className="flex-1 gap-0.5">
        <AppHeading level={3}>{isError ? 'Account' : name}</AppHeading>
        <AppText
          variant="body"
          className="text-sm text-captionDark dark:text-captionDark-dark"
        >
          {email}
        </AppText>
        {memberLine ? (
          <View className="mt-1.5 self-start rounded-full bg-surface-light px-3 py-1.5 dark:bg-surface-dark">
            <AppText variant="caption" className="text-xs">
              {memberLine}
            </AppText>
          </View>
        ) : null}
      </View>
    </AppAnimatedView>
  );
}
