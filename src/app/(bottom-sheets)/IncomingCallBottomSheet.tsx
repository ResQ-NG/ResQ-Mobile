import { useEffect } from 'react';
import { router } from 'expo-router';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { AppAnimatedView, brandFadeIn, brandFadeInUp } from '@/lib/animation';
import { useIncomingCallSheetStore } from '@/stores/incoming-call-sheet-store';
import { useInCallStore } from '@/stores/in-call-store';
import { useInChatStore } from '@/stores/in-chat-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

export function IncomingCallBottomSheet() {
  const { isOpen, callerName, close } = useIncomingCallSheetStore();
  const startCall = useInCallStore((s) => s.startCall);
  const startChat = useInChatStore((s) => s.startChat);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!isOpen) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 800 }),
        withTiming(1, { duration: 800 })
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

  const handlePickUp = usePreventDoublePress(() => {
    if (callerName) startCall({ callerName });
    close();
    router.push('/(modals)/in-call');
  });

  const handleText = usePreventDoublePress(() => {
    if (callerName) startChat({ agencyName: callerName });
    close();
    router.push('/(modals)/chat');
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
        onPress={handlePickUp}
      >
        Pick up
      </AppButton>
      <AppButton
        variant="outline"
        size="lg"
        className="w-full"
        onPress={handleText}
      >
        Text instead
      </AppButton>
    </AppAnimatedView>
  );

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={close}
      title="Incoming call"
      description={callerName ? `You're being called by ${callerName}` : "You're being called"}
      footer={footer}
      contentPadding={{ horizontal: 16, top: 0, bottom: 0 }}
    >
      <AppAnimatedView className="items-center px-2 pb-32">
        <AppAnimatedView entering={brandFadeInUp.delay(80)} style={pulseStyle}>
          <LottieView
            source={require('@assets/lottie/alert.json')}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </AppAnimatedView>
        {callerName ? (
          <AppAnimatedView
            entering={brandFadeInUp.delay(120)}
            className="mt-4 items-center"
          >
            <Avatar
              size={64}
              altText={callerName}
              backgroundColor={AVATAR_BACKGROUNDS[0]}
            />
            <AppText
              variant="body"
              className="text-center font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mt-3"
            >
              {callerName}
            </AppText>
          </AppAnimatedView>
        ) : null}
        <AppAnimatedView entering={brandFadeIn.delay(180)} className="mt-2">
          <AppText
            variant="caption"
            className="text-center text-captionDark dark:text-captionDark-dark"
          >
            Answer the call or send a message instead.
          </AppText>
        </AppAnimatedView>
      </AppAnimatedView>
    </BaseBottomSheet>
  );
}
