import React from 'react';
import { Modal, View, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from '@/components/ui/AppText';
import { useAppModalStore } from '@/stores/app-modal-store';

const RING_SIZE = 88;
const RING_STROKE = 8;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

export function AppModalView() {
  const {
    isOpen,
    state,
    progress,
    message,
    sharingTitle,
    sharingMessage,
    hide,
  } = useAppModalStore();

  if (!isOpen) return null;

  const progressLength = (progress / 100) * CIRCUMFERENCE;
  const startFromTop = CIRCUMFERENCE / 4;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={hide}
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center p-5">
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={80}
            tint="dark"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ) : (
          <View className="absolute inset-0 bg-black/60" />
        )}

        <View className="w-full max-w-[240px] bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 items-center shadow-xl">
          <TouchableOpacity
            onPress={hide}
            hitSlop={12}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 items-center justify-center z-10"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <AppText className="text-lg font-metropolis-semibold text-[#374151] dark:text-gray-300">
              ×
            </AppText>
          </TouchableOpacity>

          {state === 'loading' && (
            <>
              <View className="relative mb-3">
                <Svg width={RING_SIZE} height={RING_SIZE} style={{ alignSelf: 'center' }}>
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_R}
                    stroke="#E5E7EB"
                    strokeWidth={RING_STROKE}
                    fill="transparent"
                  />
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_R}
                    stroke="#16A34A"
                    strokeWidth={RING_STROKE}
                    fill="transparent"
                    strokeDasharray={`${progressLength} ${CIRCUMFERENCE}`}
                    strokeDashoffset={startFromTop}
                    strokeLinecap="round"
                  />
                </Svg>
                <View className="absolute inset-0 justify-center items-center">
                  <AppText className="text-lg font-metropolis-bold text-primaryDark dark:text-primaryDark-dark">
                    {Math.round(progress)}%
                  </AppText>
                </View>
              </View>
              <AppText className="text-sm font-metropolis-medium text-primaryDark dark:text-primaryDark-dark text-center">
                {message}
              </AppText>
            </>
          )}

          {state === 'sharing' && (
            <View className="items-center py-2">
              {sharingTitle ? (
                <AppText className="text-base font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-2 text-center">
                  {sharingTitle}
                </AppText>
              ) : null}
              <AppText className="text-sm font-metropolis-medium text-primaryDark dark:text-primaryDark-dark text-center">
                {message}
              </AppText>
              {sharingMessage ? (
                <AppText className="text-xs text-captionDark dark:text-captionDark-dark mt-2 text-center">
                  {sharingMessage}
                </AppText>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
