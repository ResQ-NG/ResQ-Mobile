import { View } from 'react-native';
import { router } from 'expo-router';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { useSosConfirmSheetStore } from '@/stores/sos-confirm-sheet-store';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { AppAnimatedView, brandFadeInUp, brandFadeIn } from '@/lib/animation';
import LottieView from 'lottie-react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

export default function SosConfirmBottomSheet() {
  const { isOpen, close } = useSosConfirmSheetStore();
  const contacts = useWatchMeContactsStore((s) => s.contacts);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!isOpen) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
    return () => {
      pulse.value = withTiming(1);
    };
  }, [isOpen, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleCancel = () => close();

  const handleConfirm = usePreventDoublePress(() => {
    close();
    router.push('/screens/sos');
  });

  const footer = (
    <AppAnimatedView entering={brandFadeInUp.delay(200)} className="px-4 gap-3 w-full">
      <AppButton
        variant="primary"
        size="lg"
        className="w-full bg-accent-red dark:bg-accent-red-dark border-0"
        onPress={handleConfirm}
      >
        Yes, dispatch
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
      enableDynamicSizing={true}
      isOpen={isOpen}
      onClose={handleCancel}
      title="Send SOS?"
      description="We'll dispatch to your close contacts immediately."
      footer={footer}
      contentPadding={{ horizontal: 16, top: 0, bottom: 0 }}
    >
      <AppAnimatedView className="items-center px-2 pb-32">
        <AppAnimatedView
          entering={brandFadeInUp.delay(100)}
          style={pulseStyle}
        >
          <LottieView
            source={require('@assets/lottie/alert.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
        </AppAnimatedView>
        <AppAnimatedView entering={brandFadeIn.delay(180)}>
          <AppText
            variant="body"
            className="text-center text-captionDark dark:text-captionDark-dark mt-2"
          >
            Your emergency contacts will be notified and can see your location.
          </AppText>
        </AppAnimatedView>

        {contacts.length > 0 ? (
          <AppAnimatedView
            entering={brandFadeInUp.delay(260)}
            className="mt-5 w-full"
          >
            <View className="flex-row justify-center">
              {contacts.map((c, index) => (
                <View
                  key={c.id}
                  style={{
                    marginLeft: index === 0 ? 0 : -8,
                    zIndex: contacts.length - index,
                  }}
                >
                  <Avatar
                    size={40}
                    altText={c.name}
                    backgroundColor={
                      AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length]
                    }
                  />
                </View>
              ))}
            </View>
          </AppAnimatedView>
        ) : null}
      </AppAnimatedView>
    </BaseBottomSheet>
  );
}
