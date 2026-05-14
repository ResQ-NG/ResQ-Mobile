import { View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { showToast } from '@/lib/utils/app-toast';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAuthTokenStore } from '@/stores/auth-token-store';
import { useSessionExpiredStore } from '@/stores/session-expired-store';
import { resetPersistedSessionState } from '@/stores/reset-persisted-session-state';
import { clearHttpAuthInterceptorState } from '@/network/config/http-auth-interceptor-state';

export default function SessionExpiredBottomSheet() {
  const queryClient = useQueryClient();
  const { isOpen, close } = useSessionExpiredStore();
  const setToken = useAuthTokenStore((s) => s.setToken);
  const setRefreshToken = useAuthTokenStore((s) => s.setRefreshToken);

  const handleSignOut = usePreventDoublePress(() => {
    clearHttpAuthInterceptorState();
    resetPersistedSessionState();
    queryClient.clear();
    setToken(null);
    setRefreshToken(null);
    close();
    showToast({ message: 'Signed out.', variant: 'success' });
  });

  const footer = (
    <View className="px-4 gap-3 w-full">
      <AppButton
        variant="accent"
        size="lg"
        className="w-full"
        onPress={handleSignOut}
      >
        Sign out
      </AppButton>
    </View>
  );

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={handleSignOut}
      title="We lost your session"
      description="Please sign in again to continue."
      footer={footer}
      contentPadding={{ horizontal: 16, top: 8, bottom: 8 }}
    >
      {null}
    </BaseBottomSheet>
  );
}
