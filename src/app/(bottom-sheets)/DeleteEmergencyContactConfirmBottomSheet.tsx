import { View } from 'react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { showToast } from '@/lib/utils/app-toast';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useDeleteEmergencyContact } from '@/network/modules/emergency-contacts/queries';
import { useDeleteEmergencyContactConfirmStore } from '@/stores/delete-emergency-contact-confirm-store';
import { dicebearUriToRasterImageUri } from '@/lib/third-party/dicebear';

export default function DeleteEmergencyContactConfirmBottomSheet() {
  const { isOpen, contact, close } = useDeleteEmergencyContactConfirmStore();
  const { mutate, isPending } = useDeleteEmergencyContact();

  const handleCancel = () => close();

  const handleConfirmDelete = usePreventDoublePress(() => {
    if (!contact?.id) return;
    const idNum = Number(contact.id);
    if (!Number.isFinite(idNum)) return;

    mutate(idNum, {
      onSuccess: () => {
        close();
        showToast({ message: 'Contact removed', variant: 'success' });
      },
    });
  });

  const footer = (
    <View className="px-4 gap-3 w-full">
      <AppButton
        variant="accent"
        size="lg"
        className="w-full"
        onPress={handleConfirmDelete}
        loading={isPending}
      >
        Remove contact
      </AppButton>
      <AppButton
        variant="outline"
        size="lg"
        className="w-full"
        onPress={handleCancel}
        disabled={isPending}
      >
        Cancel
      </AppButton>
    </View>
  );

  const displayName = contact?.name?.trim() ?? 'Contact';
  const avatarSource =
    contact?.avatarUrl != null && contact.avatarUrl.length > 0
      ? { uri: dicebearUriToRasterImageUri(contact.avatarUrl.trim()) }
      : undefined;

  return (
    <BaseBottomSheet
      enableDynamicSizing={false}
      snapPoints={['50%']}
      isOpen={isOpen}
      onClose={handleCancel}
      title="Remove contact?"
      description="This contact will no longer be notified during SOS or Watch Me."
      footer={footer}
      contentPadding={{ horizontal: 16, top: 8, bottom: 8 }}
    >
      <View className="px-2 pt-2 pb-4 items-center">
        <Avatar
          size={88}
          altText={displayName}
          backgroundColor={AVATAR_BACKGROUNDS[2]}
          source={avatarSource}
        />
        <AppText
          variant="body"
          className="text-center font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mt-4"
          numberOfLines={2}
        >
          {displayName}
        </AppText>
      </View>
    </BaseBottomSheet>
  );
}
