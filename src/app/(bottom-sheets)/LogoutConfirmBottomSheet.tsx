import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAuthTokenStore } from '@/stores/auth-token-store';
import { useLogoutConfirmStore } from '@/stores/logout-confirm-store';
import { resetPersistedSessionState } from '@/stores/reset-persisted-session-state';
import { clearHttpAuthInterceptorState } from '@/network/config/http-auth-interceptor-state';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { useQueryClient } from '@tanstack/react-query';

export default function LogoutConfirmBottomSheet() {
  const queryClient = useQueryClient();
  const { isOpen, close } = useLogoutConfirmStore();
  const setToken = useAuthTokenStore((s) => s.setToken);
  const setRefreshToken = useAuthTokenStore((s) => s.setRefreshToken);

  const handleCancel = () => close();

  const handleLogout = usePreventDoublePress(() => {
    clearHttpAuthInterceptorState();
    resetPersistedSessionState();
    queryClient.clear();
    setToken(null);
    setRefreshToken(null);
    close();
    router.back?.();
  });

  const footer = (
    <AppAnimatedView
      entering={brandFadeInUp.delay(200)}
      className="px-4 gap-3 w-full"
    >
      <AppButton
        variant="accent"
        size="lg"
        className="w-full"
        onPress={handleLogout}
      >
        Log out
      </AppButton>
      <AppButton
        variant="outline"
        size="lg"
        className="w-full"
        onPress={handleCancel}
      >
        Cancel
      </AppButton>
    </AppAnimatedView>
  );

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={handleCancel}
      title="Log out?"
      description="You'll need to sign in again to use your account."
      footer={footer}
      contentPadding={{ horizontal: 16, top: 0, bottom: 0 }}
    >
      <AppAnimatedView className="items-center px-2 py-10">
        <AppAnimatedView entering={brandFadeInUp.delay(80)} className="mb-4">
          <LottieView
            source={require('@assets/lottie/warning.json')}
            autoPlay
            loop={false}
            style={{ width: 120, height: 120 }}
          />
        </AppAnimatedView>
      </AppAnimatedView>
    </BaseBottomSheet>
  );
}
