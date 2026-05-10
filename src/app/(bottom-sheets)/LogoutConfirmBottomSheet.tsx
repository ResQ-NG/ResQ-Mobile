import { View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { showToast } from '@/lib/utils/app-toast';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAuthTokenStore } from '@/stores/auth-token-store';
import { useLogoutConfirmStore } from '@/stores/logout-confirm-store';
import { resetPersistedSessionState } from '@/stores/reset-persisted-session-state';

export default function LogoutConfirmBottomSheet() {
  const queryClient = useQueryClient();
  const { isOpen, close } = useLogoutConfirmStore();
  const setToken = useAuthTokenStore((s) => s.setToken);

  const handleCancel = () => close();

  const handleLogout = usePreventDoublePress(() => {
    resetPersistedSessionState();
    queryClient.clear();
    setToken(null);
    close();
    showToast({ message: 'Signed out.', variant: 'success' });
  });

  const footer = (
    <View className="px-4 gap-3 w-full">
      <AppButton
        variant="accent"
        size="lg"
        className="w-full"
        onPress={handleLogout}
      >
        Log out
      </AppButton>
    </View>
  );

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={handleCancel}
      title="Log out?"
      description="You'll need to sign in again to use your account."
      footer={footer}
      contentPadding={{ horizontal: 16, top: 8, bottom: 8 }}
    >
      {null}
    </BaseBottomSheet>
  );
}
