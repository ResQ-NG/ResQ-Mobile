import { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SolarPhoneCallingRoundedBoldIcon from '@/components/icons/solar/phone-calling-rounded-bold';
import SolarChatRoundDotsBoldIcon from '@/components/icons/solar/chat-round-dots-bold';
import SolarMaximizeSquare2BoldIcon from '@/components/icons/solar/maximize-square-2-bold';
import SolarCloseCircleBoldIcon from '@/components/icons/solar/close-circle-bold';
import { AppText } from '@/components/ui/AppText';
import { useInCallStore } from '@/stores/in-call-store';
import { useInChatStore } from '@/stores/in-chat-store';
import { useChatAgencyPickerSheetStore } from '@/stores/chat-agency-picker-sheet-store';

const CARD_STYLE = {
  borderRadius: 16,
  overflow: 'hidden' as const,
  paddingVertical: 12,
  paddingHorizontal: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 6,
};

/**
 * Single floating banner when call and/or chat are minimized.
 * Groups call and chat in one card so you don't see separate modals/banners.
 */
export function CallAndChatBanner() {
  const insets = useSafeAreaInsets();

  const callActive = useInCallStore((s) => s.isActive);
  const callExpanded = useInCallStore((s) => s.isModalExpanded);
  const callerName = useInCallStore((s) => s.callerName);
  const expandCallModal = useInCallStore((s) => s.expandModal);
  const endCall = useInCallStore((s) => s.endCall);

  const chatAgencyNames = useInChatStore((s) => s.agencyNames);
  const chatExpanded = useInChatStore((s) => s.isScreenExpanded);
  const selectAgencyForChat = useInChatStore((s) => s.selectAgencyForChat);
  const expandChatScreen = useInChatStore((s) => s.expandScreen);
  const endAllChats = useInChatStore((s) => s.endAllChats);
  const openChatPicker = useChatAgencyPickerSheetStore((s) => s.open);

  const callMinimized = callActive && !callExpanded;
  const chatMinimized = chatAgencyNames.length > 0 && !chatExpanded;
  const show = callMinimized || chatMinimized;

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (show) {
      translateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(-120, {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [show, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const onOpenCall = () => {
    expandCallModal();
    router.push('/(modals)/in-call');
  };

  const onOpenChat = () => {
    if (chatAgencyNames.length === 1) {
      selectAgencyForChat(chatAgencyNames[0]);
      expandChatScreen();
      router.push('/(modals)/chat');
    } else {
      openChatPicker();
    }
  };

  const chatLabel =
    chatAgencyNames.length === 0
      ? 'Chat'
      : chatAgencyNames.length === 1
        ? `Chat with ${chatAgencyNames[0]}`
        : `Chat with ${chatAgencyNames.join(', ')}`;

  if (!show) return null;

  return (
    <Animated.View
      pointerEvents={show ? 'auto' : 'none'}
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 58,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          ...CARD_STYLE,
          backgroundColor: 'rgba(30, 41, 59, 0.98)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
          gap: 0,
        }}
      >
        {callMinimized && (
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={onOpenCall}
              activeOpacity={0.9}
              className="flex-1 flex-row items-center min-w-0 py-1"
              accessibilityLabel="Open call"
            >
              <View className="w-10 h-10 rounded-full bg-blue-500/30 items-center justify-center mr-3">
                <SolarPhoneCallingRoundedBoldIcon
                  width={22}
                  height={22}
                  color="#93c5fd"
                />
              </View>
              <View className="flex-1 min-w-0">
                <AppText className="text-white font-metropolis-semibold text-sm">
                  Call with {callerName ?? '…'}
                </AppText>
                <AppText className="text-white/80 text-xs font-metropolis-regular">
                  Tap to open
                </AppText>
              </View>
              <SolarMaximizeSquare2BoldIcon
                width={20}
                height={20}
                color="rgba(255,255,255,0.8)"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                endCall();
              }}
              hitSlop={8}
              className="w-8 h-8 rounded-full bg-white/15 items-center justify-center ml-2"
              accessibilityLabel="End call"
            >
              <SolarCloseCircleBoldIcon width={18} height={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {callMinimized && chatMinimized && (
          <View
            className="h-px bg-white/15 mx-2"
            style={{ marginVertical: 6 }}
          />
        )}

        {chatMinimized && (
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={onOpenChat}
              activeOpacity={0.9}
              className="flex-1 flex-row items-center min-w-0 py-1"
              accessibilityLabel="Open chat"
            >
              <View className="w-10 h-10 rounded-full bg-teal-500/30 items-center justify-center mr-3">
                <SolarChatRoundDotsBoldIcon
                  width={22}
                  height={22}
                  color="#5eead4"
                />
              </View>
              <View className="flex-1 min-w-0">
                <AppText
                  className="text-white font-metropolis-semibold text-sm"
                  numberOfLines={2}
                >
                  {chatLabel}
                </AppText>
                <AppText className="text-white/80 text-xs font-metropolis-regular">
                  Tap to open
                </AppText>
              </View>
              <SolarMaximizeSquare2BoldIcon
                width={20}
                height={20}
                color="rgba(255,255,255,0.8)"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={endAllChats}
              hitSlop={8}
              className="w-8 h-8 rounded-full bg-white/15 items-center justify-center ml-2"
              accessibilityLabel="Dismiss chat"
            >
              <SolarCloseCircleBoldIcon width={18} height={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
