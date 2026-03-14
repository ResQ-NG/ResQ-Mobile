import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { useEndSosConfirmSheetStore } from '@/stores/end-sos-confirm-sheet-store';
import { useSosEvidenceStore } from '@/stores/sos-evidence-store';
import { useSosActiveStore } from '@/stores/sos-active-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { AppAnimatedView, brandFadeIn, brandFadeInUp } from '@/lib/animation';

export function EndSosConfirmBottomSheet() {
  const { isOpen, close } = useEndSosConfirmSheetStore();

  const handleCancel = () => close();

  const handleConfirmSafe = usePreventDoublePress(() => {
    useSosActiveStore.getState().setInactive();
    useSosEvidenceStore.getState().clear();
    close();
    router.back();
  });

  const footer = (
    <AppAnimatedView
      entering={brandFadeInUp.delay(200)}
      className="px-4 gap-3 w-full"
    >
      <AppButton
        variant="primary"
        size="lg"
        className="w-full"
        onPress={handleConfirmSafe}
      >
        Yes, I&apos;m safe
      </AppButton>
      <AppButton
        variant="outline"
        size="lg"
        className="w-full"
        onPress={handleCancel}
      >
        No, keep SOS active
      </AppButton>
    </AppAnimatedView>
  );

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={handleCancel}
      title="End SOS?"
      description="Are you actually safe? Only end if you're out of danger."
      footer={footer}
      contentPadding={{ horizontal: 16, top: 0, bottom: 0 }}
    >
      <AppAnimatedView className="items-center px-2 pb-40">
        <AppAnimatedView entering={brandFadeInUp.delay(80)} className="mb-4">
          <LottieView
            source={require('@assets/lottie/safe.json')}
            autoPlay
            loop={false}
            style={{ width: 120, height: 120 }}
          />
        </AppAnimatedView>
        <AppAnimatedView entering={brandFadeIn.delay(140)}>
          <AppText
            variant="body"
            className="text-center text-captionDark dark:text-captionDark-dark"
          >
            Your contacts and agencies will stop receiving your live location
            once you end the SOS.
          </AppText>
        </AppAnimatedView>
      </AppAnimatedView>
    </BaseBottomSheet>
  );
}
