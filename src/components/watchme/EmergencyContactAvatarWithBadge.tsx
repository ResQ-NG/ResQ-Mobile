import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Avatar, type AvatarProps } from '@/components/ui/Avatar';
import { useAppColorScheme } from '@/theme/colorMode';

type Props = {
  size: AvatarProps['size'];
  altText: string;
  backgroundColor?: string;
  avatarUrl?: string | null;
  isAppUser: boolean;
  /** Softer grey pill instead of amber “Invite” (e.g. Start Watch Me picker). */
  inviteBadgeMuted?: boolean;
  /** Hide the “Invite” pill entirely (e.g. Watch Me map / sheet list). */
  hideInviteBadge?: boolean;
  /** De-emphasize avatar for contacts not on the app yet (Watch Me map mode). */
  dimNonAppAvatar?: boolean;
};

/**
 * Avatar with an optional “Invite” pill for contacts not on ResQ yet.
 * On-app contacts use a plain avatar (no “App” badge).
 */
export function EmergencyContactAvatarWithBadge({
  size = 40,
  altText,
  backgroundColor,
  avatarUrl,
  isAppUser,
  inviteBadgeMuted = false,
  hideInviteBadge = false,
  dimNonAppAvatar = false,
}: Props) {
  const { isDark, theme } = useAppColorScheme();
  const source =
    avatarUrl != null && avatarUrl.length > 0 ? { uri: avatarUrl } : undefined;
  const badgeScale = typeof size === 'number' ? Math.max(0.75, size / 44) : 1;
  const fontSize = Math.round(8.5 * badgeScale);
  const padX = Math.round(6 * badgeScale);
  const padY = Math.max(2, Math.round(3 * badgeScale));

  const inviteStyles = inviteBadgeMuted
    ? {
        backgroundColor: isDark
          ? 'rgba(148, 163, 184, 0.18)'
          : 'rgba(0, 0, 0, 0.06)',
        color: theme.textMuted,
        shadowOpacity: isDark ? 0.12 : 0.04,
      }
    : isDark
      ? {
          backgroundColor: 'rgba(66, 32, 6, 0.94)',
          color: '#FEF9C3',
          shadowOpacity: 0.35,
        }
      : {
          backgroundColor: '#FFFBEB',
          color: '#92400E',
          shadowOpacity: 0.08,
        };

  const showInvitePill = !isAppUser && !hideInviteBadge;
  const dimAvatar = dimNonAppAvatar && !isAppUser;

  return (
    <View className="relative items-center justify-center">
      <View style={dimAvatar ? { opacity: 0.5 } : undefined}>
        <Avatar
          size={size}
          source={source}
          backgroundColor={backgroundColor}
          altText={altText}
        />
      </View>
      {showInvitePill ? (
        <View
          className="absolute -top-1 -right-0.5 rounded-full overflow-hidden border-2 border-white dark:border-[#1a1a1a]"
          style={{
            paddingHorizontal: padX,
            paddingVertical: padY,
            backgroundColor: inviteStyles.backgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: inviteStyles.shadowOpacity,
            shadowRadius: inviteBadgeMuted ? 1 : 2,
            elevation: inviteBadgeMuted ? 0 : 2,
          }}
        >
          <AppText
            className="font-metropolis-semibold"
            style={{
              fontSize,
              letterSpacing: 0.35,
              color: inviteStyles.color,
            }}
            numberOfLines={1}
          >
            Invite
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
