import { View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui';
import { SettingsProfileCardSkeleton } from '@/components/settings/SettingsProfileCardSkeleton';
import { useCurrentUserProfileAvatar } from '@/hooks/useCurrentUserProfileAvatar';
import { formatAuthProfileMemberSinceLabel } from '@/network/modules/auth/utils';

export function SettingsProfileCard() {
  const { data: profile, isPending, isError, avatarUri, displayName } =
    useCurrentUserProfileAvatar();

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
      <View className="relative h-24 w-24 overflow-hidden rounded-full">
        <Avatar
          size={96}
          altText={name}
          backgroundColor={AVATAR_BACKGROUNDS[2]}
          source={avatarUri ? { uri: avatarUri } : undefined}
        />
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
