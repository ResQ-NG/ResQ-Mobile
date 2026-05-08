import { View } from 'react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import {
  Avatar,
  AVATAR_BACKGROUNDS,
  avatarRemoteSource,
} from '@/components/ui/Avatar';
import { useInviteContactSheetStore } from '@/stores/invite-contact-sheet-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useInviteUser } from '@/network/modules/emergency-contacts/queries';

export default function InviteContactBottomSheet() {
  const { isOpen, contact, close } = useInviteContactSheetStore();
  const inviteUser = useInviteUser();

  const handleInvite = usePreventDoublePress(async () => {
    if (!contact?.id) return;
    await inviteUser.mutateAsync(contact.id);
    close();
  });

  const footer = (
    <View className="px-4 w-full gap-3 pb-2">
      <AppButton
        variant="primary"
        size="lg"
        className="w-full"
        onPress={handleInvite}
        disabled={inviteUser.isPending}
      >
        {inviteUser.isPending ? 'Inviting…' : 'Invite'}
      </AppButton>
      <AppButton variant="outline" size="lg" className="w-full" onPress={close}>
        Not now
      </AppButton>
    </View>
  );

  const name = contact?.name?.trim() ?? 'Contact';
  const source = avatarRemoteSource(contact?.avatarUrl);

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={close}
      title="Invite to ResQ"
      footer={footer}
      contentPadding={{ horizontal: 20, top: 8, bottom: 8 }}
    >
      <View className="items-center px-2 pb-6">
        <Avatar
          size={104}
          altText={name}
          backgroundColor={AVATAR_BACKGROUNDS[2]}
          source={source}
        />
        <AppText
          variant="body"
          className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark text-center mt-4"
          numberOfLines={2}
        >
          {name}
        </AppText>
        <AppText
          variant="caption"
          className="text-center text-captionDark dark:text-captionDark-dark mt-2 px-2 leading-5"
        >
          {`They're not on the app yet. Send an invite so they can get updates when you use Watch Me or SOS.`}
        </AppText>
      </View>
    </BaseBottomSheet>
  );
}
