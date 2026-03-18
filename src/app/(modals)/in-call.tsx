import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MingcuteArrowDownLineIcon from '@/components/icons/mingcute/arrow-down-line';
import MingcuteMicrophoneLineIcon from '@/components/icons/mingcute/microphone-line';
import MingcuteSpeakerLineIcon from '@/components/icons/mingcute/speaker-line';
import MingcuteVideoCameraLineIcon from '@/components/icons/mingcute/video-camera-line';
import MingcutePhoneOffFillIcon from '@/components/icons/mingcute/phone-off-fill';
import { AppText } from '@/components/ui/AppText';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import { useInCallStore } from '@/stores/in-call-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useAppColorScheme } from '@/theme/colorMode';

function avatarColorIndex(name: string | null): number {
  if (!name) return 0;
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return sum % AVATAR_BACKGROUNDS.length;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const CONTROL_BUTTON_SIZE = 52;
const END_CALL_SIZE = 64;

export default function InCallScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppColorScheme();
  const {
    isActive,
    callerName,
    startedAt,
    endCall,
    minimizeModal,
  } = useInCallStore();

  const [durationMs, setDurationMs] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    if (!isActive || !startedAt) return;
    const interval = setInterval(() => {
      setDurationMs(Date.now() - startedAt);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, startedAt]);

  const handleMinimize = usePreventDoublePress(() => {
    minimizeModal();
    router.back();
  });

  const handleEndCall = usePreventDoublePress(() => {
    endCall();
    router.back();
  });

  const iconColor = theme.textMuted;
  const topPad = insets.top + 12;
  const bottomPad = insets.bottom + 24;
  const horizontalPad = 20;

  return (
    <View
      className="flex-1 bg-white dark:bg-[#1a1a1a]"
      style={{ paddingTop: topPad, paddingBottom: bottomPad, paddingHorizontal: horizontalPad }}
    >
      {/* Header: minimize (arrow down), duration */}
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          onPress={handleMinimize}
          hitSlop={12}
          className="w-11 h-11 rounded-full items-center justify-center bg-black/10 dark:bg-white/10"
          accessibilityLabel="Minimize call"
        >
          <MingcuteArrowDownLineIcon width={22} height={22} color={iconColor} />
        </TouchableOpacity>
        <AppText className="text-sm font-metropolis-semibold text-captionDark dark:text-captionDark-dark tabular-nums">
          {formatDuration(durationMs)}
        </AppText>
        <View className="w-11" />
      </View>

      {/* Content: avatar + name + call type */}
      <View className="flex-1 items-center justify-center">
        <Avatar
          size={100}
          altText={callerName ?? 'Call'}
          backgroundColor={AVATAR_BACKGROUNDS[avatarColorIndex(callerName)]}
          className="mb-3"
        />
        <AppText className="text-lg font-metropolis-bold text-primaryDark dark:text-primaryDark-dark text-center">
          {callerName ?? 'Call in progress'}
        </AppText>
        <AppText className="text-sm font-metropolis-medium text-captionDark dark:text-captionDark-dark mt-0.5">
          {isVideoOn ? 'Video call' : 'Voice call'}
        </AppText>
      </View>

      {/* Controls: mute, video, speaker row; end call below */}
      <View className="items-center gap-5">
        <View className="flex-row items-center justify-center gap-6">
          <TouchableOpacity
            onPress={() => setIsMuted((m) => !m)}
            className="items-center gap-1.5"
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
          >
            <View
              className="rounded-full items-center justify-center bg-black/8 dark:bg-white/8"
              style={[
                { width: CONTROL_BUTTON_SIZE, height: CONTROL_BUTTON_SIZE },
                isMuted && { backgroundColor: 'rgba(239,68,68,0.18)' },
              ]}
            >
              <MingcuteMicrophoneLineIcon
                width={24}
                height={24}
                color={isMuted ? '#ef4444' : iconColor}
              />
            </View>
            <AppText className="text-[11px] font-metropolis-medium text-captionDark dark:text-captionDark-dark">
              {isMuted ? 'Unmute' : 'Mute'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsVideoOn((v) => !v)}
            className="items-center gap-1.5"
            accessibilityLabel={isVideoOn ? 'Switch to voice' : 'Switch to video'}
          >
            <View
              className="rounded-full items-center justify-center bg-black/8 dark:bg-white/8"
              style={[
                { width: CONTROL_BUTTON_SIZE, height: CONTROL_BUTTON_SIZE },
                isVideoOn && { backgroundColor: 'rgba(37,99,235,0.18)' },
              ]}
            >
              <MingcuteVideoCameraLineIcon
                width={24}
                height={24}
                color={isVideoOn ? '#2563eb' : iconColor}
              />
            </View>
            <AppText className="text-[11px] font-metropolis-medium text-captionDark dark:text-captionDark-dark">
              {isVideoOn ? 'Video on' : 'Video'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSpeakerOn((s) => !s)}
            className="items-center gap-1.5"
            accessibilityLabel={isSpeakerOn ? 'Speaker off' : 'Speaker on'}
          >
            <View
              className="rounded-full items-center justify-center bg-black/8 dark:bg-white/8"
              style={[
                { width: CONTROL_BUTTON_SIZE, height: CONTROL_BUTTON_SIZE },
                isSpeakerOn && { backgroundColor: 'rgba(37,99,235,0.18)' },
              ]}
            >
              <MingcuteSpeakerLineIcon
                width={24}
                height={24}
                color={isSpeakerOn ? '#2563eb' : iconColor}
              />
            </View>
            <AppText className="text-[11px] font-metropolis-medium text-captionDark dark:text-captionDark-dark">
              {isSpeakerOn ? 'Speaker on' : 'Speaker'}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleEndCall}
          activeOpacity={0.85}
          className="rounded-full bg-red-500 dark:bg-red-600 items-center justify-center mt-1"
          style={{ width: END_CALL_SIZE, height: END_CALL_SIZE }}
          accessibilityLabel="End call"
        >
          <MingcutePhoneOffFillIcon width={28} height={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
