import { View, Share } from 'react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { useInviteContactSheetStore } from '@/stores/invite-contact-sheet-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { showToast } from '@/lib/utils/app-toast';
import { dicebearUriToRasterImageUri } from '@/lib/third-party/dicebear';

const INVITE_STORE_URL = 'https://resq.app';

function buildInviteMessage(contactName: string): string {
  return `Hi ${contactName},\n\nJoin me on ResQ for safety check-ins and emergency alerts when it matters.\n\n${INVITE_STORE_URL}`;
}

export default function InviteContactBottomSheet() {
  const { isOpen, contact, close } = useInviteContactSheetStore();

  const handleInvite = usePreventDoublePress(async () => {
    if (!contact?.name) return;
    const message = buildInviteMessage(contact.name.trim());
    try {
      const result = await Share.share({
        message,
        title: `Invite ${contact.name}`,
      });
      if (result.action === Share.sharedAction) {
        showToast({ message: 'Invite sent', variant: 'success' });
        close();
      }
    } catch {
      showToast({
        message: 'Could not open share sheet. Try again.',
        variant: 'error',
      });
    }
  });

  const footer = (
    <View className="px-4 w-full gap-3 pb-2">
      <AppButton
        variant="primary"
        size="lg"
        className="w-full"
        onPress={handleInvite}
      >
        Invite
      </AppButton>
      <AppButton variant="outline" size="lg" className="w-full" onPress={close}>
        Not now
      </AppButton>
    </View>
  );

  const name = contact?.name?.trim() ?? 'Contact';
  const source =
    contact?.avatarUrl != null && contact.avatarUrl.length > 0
      ? { uri: dicebearUriToRasterImageUri(contact.avatarUrl.trim()) }
      : undefined;

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
