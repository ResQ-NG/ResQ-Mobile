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
import { LinearGradient } from 'expo-linear-gradient';
import SolarChatRoundDotsBoldIcon from '@/components/icons/solar/chat-round-dots-bold';
import { AppText } from '@/components/ui/AppText';
import { useInChatStore } from '@/stores/in-chat-store';
import { useChatAgencyPickerSheetStore } from '@/stores/chat-agency-picker-sheet-store';

/**
 * Floating in-chat banner shown when at least one chat is active and the chat screen is not open.
 * Shows "Chat with X" or "Chat with X, Y, Z". Tap: single agency opens chat; multiple opens picker sheet.
 * Dismiss (X) ends all chats.
 */
export function InChatBanner() {
  const insets = useSafeAreaInsets();
  const agencyNames = useInChatStore((s) => s.agencyNames);
  const isScreenExpanded = useInChatStore((s) => s.isScreenExpanded);
  const selectAgencyForChat = useInChatStore((s) => s.selectAgencyForChat);
  const expandScreen = useInChatStore((s) => s.expandScreen);
  const endAllChats = useInChatStore((s) => s.endAllChats);
  const openPickerSheet = useChatAgencyPickerSheetStore((s) => s.open);

  const isActive = agencyNames.length > 0;
  const label =
    agencyNames.length === 0
      ? 'Chat'
      : agencyNames.length === 1
        ? `Chat with ${agencyNames[0]}`
        : `Chat with ${agencyNames.join(', ')}`;

  const handlePress = () => {
    if (agencyNames.length === 1) {
      selectAgencyForChat(agencyNames[0]);
      expandScreen();
      router.push('/(modals)/chat');
    } else {
      openPickerSheet();
    }
  };

  const handleDismiss = () => endAllChats();

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const show = isActive && !isScreenExpanded;

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
      translateY.value = withTiming(-100, {
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

  if (!isActive) return null;

  return (
    <Animated.View
      pointerEvents={show ? 'auto' : 'none'}
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 55,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={['#0f766e', '#0d9488', '#14b8a6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.9}
          className="flex-1 flex-row items-center min-w-0"
          accessibilityRole="button"
          accessibilityLabel="Open chat"
        >
          <View className="w-10 h-10 rounded-full bg-white/25 items-center justify-center mr-3">
            <SolarChatRoundDotsBoldIcon width={22} height={22} color="#fff" />
          </View>
          <View className="flex-1 min-w-0">
            <AppText
              className="text-white font-metropolis-semibold text-sm"
              numberOfLines={2}
            >
              {label}
            </AppText>
            <AppText className="text-white/90 text-xs font-metropolis-regular mt-0.5">
              Tap to open chat
            </AppText>
          </View>
          <AppText className="text-white/90 text-lg font-metropolis-bold ml-1">
            ↑
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDismiss}
          hitSlop={8}
          className="w-8 h-8 rounded-full bg-white/20 items-center justify-center ml-2"
          accessibilityLabel="Dismiss chat"
        >
          <AppText className="text-white text-base font-metropolis-bold">×</AppText>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}
