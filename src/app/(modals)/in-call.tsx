import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import SolarMicrophoneBoldIcon from '@/components/icons/solar/microphone-bold';
import SolarSpeakerBoldIcon from '@/components/icons/solar/speaker-bold';
import SolarCloseCircleBoldIcon from '@/components/icons/solar/close-circle-bold';
import SolarMinimizeSquare2BoldIcon from '@/components/icons/solar/minimize-square-2-bold';
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

const END_CALL_BUTTON_SIZE = 72;

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
  const horizontalPad = 24;

  return (
    <View
      className="flex-1 bg-white dark:bg-[#1a1a1a]"
      style={{ paddingTop: topPad, paddingBottom: bottomPad, paddingHorizontal: horizontalPad }}
    >
      {/* Header: minimize left, duration right */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity
          onPress={handleMinimize}
          hitSlop={12}
          className="w-12 h-12 rounded-full items-center justify-center border border-black/12 dark:border-white/15 bg-black/12 dark:bg-white/15"
          accessibilityLabel="Minimize call"
        >
          <SolarMinimizeSquare2BoldIcon
            width={24}
            height={24}
            color={theme.iconOnAccent}
          />
        </TouchableOpacity>
        <AppText className="text-sm font-metropolis-semibold text-captionDark dark:text-captionDark-dark tabular-nums">
          {formatDuration(durationMs)}
        </AppText>
        <View className="w-11" />
      </View>

      {/* Content: avatar + name */}
      <View className="flex-1 items-center justify-center">
        <Avatar
          size={112}
          altText={callerName ?? 'Call'}
          backgroundColor={AVATAR_BACKGROUNDS[avatarColorIndex(callerName)]}
          className="mb-4"
        />
        <AppText className="text-xl font-metropolis-bold text-primaryDark dark:text-primaryDark-dark text-center">
          {callerName ?? 'Call in progress'}
        </AppText>
        <AppText className="text-sm font-metropolis-medium text-captionDark dark:text-captionDark-dark mt-1">
          In call
        </AppText>
      </View>

      {/* Controls: mute + speaker row, then end call */}
      <View className="items-center gap-6">
        <View className="flex-row items-center justify-center gap-8">
          <TouchableOpacity
            onPress={() => setIsMuted((m) => !m)}
            className="items-center gap-2"
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
          >
            <View
              className="w-14 h-14 rounded-full items-center justify-center bg-black/8 dark:bg-white/8"
              style={isMuted ? { backgroundColor: 'rgba(239,68,68,0.2)' } : undefined}
            >
              <SolarMicrophoneBoldIcon
                width={26}
                height={26}
                color={isMuted ? '#ef4444' : iconColor}
              />
            </View>
            <AppText className="text-xs font-metropolis-medium text-captionDark dark:text-captionDark-dark">
              {isMuted ? 'Unmute' : 'Mute'}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsSpeakerOn((s) => !s)}
            className="items-center gap-2"
            accessibilityLabel={isSpeakerOn ? 'Speaker off' : 'Speaker on'}
          >
            <View
              className="w-14 h-14 rounded-full items-center justify-center bg-black/8 dark:bg-white/8"
              style={isSpeakerOn ? { backgroundColor: 'rgba(37,99,235,0.2)' } : undefined}
            >
              <SolarSpeakerBoldIcon
                width={26}
                height={26}
                color={isSpeakerOn ? '#2563eb' : iconColor}
              />
            </View>
            <AppText className="text-xs font-metropolis-medium text-captionDark dark:text-captionDark-dark">
              {isSpeakerOn ? 'Speaker on' : 'Speaker'}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleEndCall}
          activeOpacity={0.85}
          className="rounded-full bg-red-500 dark:bg-red-600 items-center justify-center mt-2"
          style={{ width: END_CALL_BUTTON_SIZE, height: END_CALL_BUTTON_SIZE }}
          accessibilityLabel="End call"
        >
          <SolarCloseCircleBoldIcon width={32} height={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
