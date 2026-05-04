import { useGetProfileInformation } from '@/network/modules/auth/queries';
import { formatAuthProfileDisplayName } from '@/network/modules/auth/utils';

/**
 * Signed-in user’s avatar URL and display name from {@link useGetProfileInformation}.
 * Use for “you” UI (camera header, map user pin, etc.).
 */
export function useCurrentUserProfileAvatar() {
  const query = useGetProfileInformation();
  const profile = query.data;
  const avatarUri = profile?.avatar_url?.trim() || undefined;
  const displayName = profile ? formatAuthProfileDisplayName(profile) : 'You';

  return {
    ...query,
    avatarUri,
    displayName,
  };
}
