import { View } from 'react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { showToast } from '@/lib/utils/app-toast';
import { useEndWatchMeConfirmStore } from '@/stores/end-watch-me-confirm-store';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import LottieView from 'lottie-react-native';

export function EndWatchMeConfirmBottomSheet() {
  const { isOpen, close } = useEndWatchMeConfirmStore();
  const setSessionActive = useWatchMeContactsStore((s) => s.setSessionActive);

  const handleCancel = () => close();

  const handleEndSession = usePreventDoublePress(() => {
    setSessionActive(false);
    close();
    showToast({
      message: 'Watch Me session ended',
      variant: 'success',
    });
  });

  const footer = (
    <View className="px-4 gap-3 w-full flex-row">
      <AppButton
        variant="primary"
        size="lg"
        className="flex-1 bg-accent-red dark:bg-accent-red-dark"
        onPress={handleEndSession}
      >
        End session
      </AppButton>
    </View>
  );

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={handleCancel}
      title="End Watch Me?"
      description="Your presence will no longer be shared with your contacts."
      footer={footer}
      contentPadding={{ horizontal: 16, top: 0, bottom: 0 }}
    >
      <View className="px-4 flex items-center pb-10">
        <LottieView
          source={require('@assets/lottie/pickme.json')}
          autoPlay
          loop={false}
          style={{ width: 300, height: 200 }}
        />
      </View>
    </BaseBottomSheet>
  );
}
