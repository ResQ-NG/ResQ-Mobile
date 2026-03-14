import {  TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { useChatAgencyPickerSheetStore } from '@/stores/chat-agency-picker-sheet-store';
import { useInChatStore } from '@/stores/in-chat-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

function avatarColorIndex(name: string): number {
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return sum % AVATAR_BACKGROUNDS.length;
}

export function ChatAgencyPickerBottomSheet() {
  const { isOpen, close } = useChatAgencyPickerSheetStore();
  const agencyNames = useInChatStore((s) => s.agencyNames);
  const selectAgencyForChat = useInChatStore((s) => s.selectAgencyForChat);

  const handleSelect = usePreventDoublePress((agencyName: string) => {
    selectAgencyForChat(agencyName);
    close();
    router.push('/(modals)/chat');
  });

  return (
    <BaseBottomSheet
      enableDynamicSizing
      isOpen={isOpen}
      onClose={close}
      title="Chat with"
      description="Select an agency to open the conversation."
      contentPadding={{ horizontal: 16, top: 0, bottom: 0 }}
    >
      <AppAnimatedView className="pb-40">
        {agencyNames.map((name, index) => (
          <TouchableOpacity
            key={name}
            onPress={() => handleSelect(name)}
            activeOpacity={0.7}
            className="flex-row items-center gap-3 py-3.5 px-2 rounded-xl active:bg-black/5 dark:active:bg-white/5"
            accessibilityRole="button"
            accessibilityLabel={`Chat with ${name}`}
          >
            <AppAnimatedView entering={brandFadeInUp.delay(80 + index * 50)}>
              <Avatar
                size={44}
                altText={name}
                backgroundColor={AVATAR_BACKGROUNDS[avatarColorIndex(name)]}
              />
            </AppAnimatedView>
            <AppText className="flex-1 text-base font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
              {name}
            </AppText>
          </TouchableOpacity>
        ))}
      </AppAnimatedView>
    </BaseBottomSheet>
  );
}
