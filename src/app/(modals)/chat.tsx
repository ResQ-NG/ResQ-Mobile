import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import MingcuteArrowDownLineIcon from '@/components/icons/mingcute/arrow-down-line';
import MingcuteCloseLineIcon from '@/components/icons/mingcute/close-line';
import SolarPlain2BoldIcon from '@/components/icons/solar/plain-2-bold';
import { useInChatStore } from '@/stores/in-chat-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAppColorScheme } from '@/theme/colorMode';

function avatarColorIndex(name: string | null): number {
  if (!name) return 0;
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return sum % AVATAR_BACKGROUNDS.length;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();
  const {
    currentAgencyName: agencyName,
    minimizeScreen,
    endChat,
  } = useInChatStore();
  const [message, setMessage] = useState('');

  const handleMinimize = usePreventDoublePress(() => {
    minimizeScreen();
    router.back();
  });

  const handleEndChat = usePreventDoublePress(() => {
    endChat(agencyName ?? undefined);
    router.back();
  });

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-[#1a1a1a]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
        style={{ paddingTop: insets.top + 12, paddingBottom: 12, paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          onPress={handleMinimize}
          hitSlop={12}
          className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 items-center justify-center"
          accessibilityLabel="Minimize chat"
        >
          <MingcuteArrowDownLineIcon width={22} height={22} color={theme.textMuted} />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2 flex-1 justify-center">
          <Avatar
            size={36}
            altText={agencyName ?? 'Chat'}
            backgroundColor={AVATAR_BACKGROUNDS[avatarColorIndex(agencyName)]}
          />
          <AppText className="text-base font-metropolis-bold text-primaryDark dark:text-primaryDark-dark">
            {agencyName ?? 'Chat'}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={handleEndChat}
          hitSlop={12}
          className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 items-center justify-center"
          accessibilityLabel="End chat"
        >
          <MingcuteCloseLineIcon width={22} height={22} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Messages area */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 24,
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center py-8">
          <Avatar
            size={64}
            altText={agencyName ?? 'Agency'}
            backgroundColor={AVATAR_BACKGROUNDS[avatarColorIndex(agencyName)]}
            className="mb-4"
          />
          <AppText className="text-lg font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-1">
            Chat with {agencyName ?? 'agency'}
          </AppText>
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark text-center max-w-[240px]"
          >
            Messages will appear here. Use the field below to send a message.
          </AppText>
        </View>
      </ScrollView>

      {/* Input area */}
      <View
        className="flex-row items-end gap-2 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] px-4 py-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <TextInput
          className="flex-1 bg-black/5 dark:bg-white/10 rounded-2xl px-4 py-3 text-base text-primaryDark dark:text-primaryDark-dark font-metropolis-regular min-h-[48px] max-h-28"
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={2000}
          editable
        />
        <TouchableOpacity
          onPress={() => setMessage('')}
          className="w-12 h-12 rounded-full bg-primary-blue dark:bg-primary-blue-dark items-center justify-center"
          accessibilityLabel="Send message"
        >
          <SolarPlain2BoldIcon width={22} height={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
