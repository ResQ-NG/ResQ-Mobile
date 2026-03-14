import { useState, useEffect } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
  AppAnimatedView,
  brandFadeIn,
  brandFadeInUp,
} from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { useAppColorScheme } from '@/theme/colorMode';
import { RoundedButton } from '@/components/ui/RoundedButton';
import { Avatar, AVATAR_BACKGROUNDS } from '@/components/ui/Avatar';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import SolarEyeBoldIcon from '@/components/icons/solar/eye-bold';
import SolarPhoneCallingRoundedBoldIcon from '@/components/icons/solar/phone-calling-rounded-bold';
import SolarChatRoundDotsBoldIcon from '@/components/icons/solar/chat-round-dots-bold';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { useSosEvidenceStore } from '@/stores/sos-evidence-store';
import { useSosActiveStore } from '@/stores/sos-active-store';
import { useEndSosConfirmSheetStore } from '@/stores/end-sos-confirm-sheet-store';
import { useInCallStore } from '@/stores/in-call-store';
import { useInChatStore } from '@/stores/in-chat-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import {
  AttentionShake,
  EvidencePlaceholder,
  EvidenceThumbnail,
  EvidenceNoteCard,
} from './components';

/** Mock agencies viewing this SOS. requestCall/requestChat = badge on icon when agency wants to connect. */
const MOCK_AGENCIES = [
  {
    id: '1',
    name: 'Police',
    canCall: true,
    canChat: true,
    requestCall: true,
    requestChat: false,
  },
  {
    id: '2',
    name: 'FRSC',
    canCall: true,
    canChat: true,
    requestCall: false,
    requestChat: true,
  },
] as const;

function formatActiveSince(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SosScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeSince] = useState(() => Date.now());
  const contacts = useWatchMeContactsStore((s) => s.contacts);
  const { items: evidenceItems, removeMedia } = useSosEvidenceStore();

  const handleBack = usePreventDoublePress(() => router.back());
  const openEndSosConfirmSheet = useEndSosConfirmSheetStore((s) => s.open);
  const setSosActive = useSosActiveStore((s) => s.setActive);

  useEffect(() => {
    setSosActive();
  }, [setSosActive]);

  const handleEndSos = usePreventDoublePress(() => {
    openEndSosConfirmSheet();
  });

  const handleCaptureWhatIsHappening = usePreventDoublePress(() => {
    router.push('/screens/sos/evidence');
  });

  const startCall = useInCallStore((s) => s.startCall);
  const handleCallAgency = usePreventDoublePress((agencyName: string) => {
    startCall({ callerName: agencyName });
    router.push('/(modals)/in-call');
  });

  const startChat = useInChatStore((s) => s.startChat);
  const handleChatAgency = usePreventDoublePress((agencyName: string) => {
    startChat({ agencyName });
    router.push('/(modals)/chat');
  });

  const thumbnailSize = (width - 32 - 24) / 4 - 8;

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="md"
      header={
        <AppAnimatedView
          entering={brandFadeIn}
          className="flex-row items-center justify-between py-2"
        >
          <RoundedButton
            onPress={handleBack}
            icon={
              <SolarArrowLeftBrokenIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
            className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
            accessibilityLabel="Back"
          />
          <AppButton variant="outline" size="sm" onPress={handleEndSos}>
            End SOS
          </AppButton>
        </AppAnimatedView>
      }
      footer={
        <View
          className={` border-t border-[rgba(0,0,0,0.06)]  dark:border-[rgba(255,255,255,0.08)] ${theme.background}`}
        >
          <AppButton
            variant="primary"
            size="lg"
            onPress={handleCaptureWhatIsHappening}
          >
            {`Capture what's happening`}
          </AppButton>
        </View>
      }
    >
      <AppAnimatedScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 88 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + Active since */}
        <AppAnimatedView entering={brandFadeIn.delay(60)} className="mb-6">
          <AppText className="text-3xl font-metropolis-bold text-primaryDark dark:text-primaryDark-dark">
            SOS
          </AppText>
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark mt-1"
          >
            Active since {formatActiveSince(activeSince)}
          </AppText>
        </AppAnimatedView>

        {/* Who's viewing: contacts + agencies */}
        <AppAnimatedView
          entering={brandFadeIn.delay(100)}
          className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.1)]"
        >
          <AppAnimatedView className="flex-row items-center gap-2 mb-3">
            <SolarEyeBoldIcon width={18} height={18} color={theme.textMuted} />
            <AppText className="text-sm font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
              {`Who's viewing`}
            </AppText>
          </AppAnimatedView>

          {/* Your contacts */}
          <AppText className="text-xs font-metropolis-semibold text-captionDark dark:text-captionDark-dark mb-2">
            Your contacts
          </AppText>
          {contacts.length > 0 ? (
            <AppAnimatedView className="flex-row flex-wrap gap-3 mb-4">
              {contacts.map((c, index) => (
                <AppAnimatedView
                  key={c.id}
                  entering={brandFadeInUp.delay(120 + index * 40)}
                  className="items-center"
                >
                  <Avatar
                    size={44}
                    altText={c.name}
                    backgroundColor={
                      AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length]
                    }
                  />
                  <AppText
                    className="text-[11px] text-captionDark dark:text-captionDark-dark mt-1 max-w-[56px]"
                    numberOfLines={1}
                  >
                    {c.name}
                  </AppText>
                </AppAnimatedView>
              ))}
            </AppAnimatedView>
          ) : (
            <AppText
              variant="caption"
              className="text-captionDark dark:text-captionDark-dark mb-4"
            >
              Your emergency contacts will appear here when they open your SOS.
            </AppText>
          )}

          {/* Agencies (Police, FRSC, etc.) — space for call/chat indicators */}
          <AppText className="text-xs font-metropolis-semibold text-captionDark dark:text-captionDark-dark mb-2">
            Agencies
          </AppText>
          <View className="gap-2">
            {MOCK_AGENCIES.map((agency, index) => (
              <AppAnimatedView
                key={agency.id}
                entering={brandFadeInUp.delay(160 + index * 50)}
                className="flex-row items-center gap-3 py-2.5 px-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
              >
                <Avatar
                  size={40}
                  altText={agency.name}
                  backgroundColor={
                    AVATAR_BACKGROUNDS[(index + 2) % AVATAR_BACKGROUNDS.length]
                  }
                />
                <AppText className="flex-1 text-sm font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark">
                  {agency.name}
                </AppText>
                <View className="flex-row items-center gap-1">
                  {agency.canCall ? (
                    agency.requestCall ? (
                      <AttentionShake delayMs={0}>
                        <TouchableOpacity
                          onPress={() => handleCallAgency(agency.name)}
                          className="w-9 h-9 rounded-full bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)] items-center justify-center"
                          accessibilityLabel={`Call ${agency.name}`}
                        >
                          <View className="relative">
                            <SolarPhoneCallingRoundedBoldIcon
                              width={18}
                              height={18}
                              color={theme.textMuted}
                            />
                            <View
                              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-red dark:bg-accent-red-dark border-2 border-white dark:border-[#1a1a1a]"
                              pointerEvents="none"
                            />
                          </View>
                        </TouchableOpacity>
                      </AttentionShake>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleCallAgency(agency.name)}
                        className="w-9 h-9 rounded-full bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)] items-center justify-center"
                        accessibilityLabel={`Call ${agency.name}`}
                      >
                        <SolarPhoneCallingRoundedBoldIcon
                          width={18}
                          height={18}
                          color={theme.textMuted}
                        />
                      </TouchableOpacity>
                    )
                  ) : null}
                  {agency.canChat ? (
                    agency.requestChat ? (
                      <AttentionShake delayMs={450}>
                        <TouchableOpacity
                          onPress={() => handleChatAgency(agency.name)}
                          className="w-9 h-9 rounded-full bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)] items-center justify-center"
                          accessibilityLabel={`Chat with ${agency.name}`}
                        >
                          <View className="relative">
                            <SolarChatRoundDotsBoldIcon
                              width={18}
                              height={18}
                              color={theme.textMuted}
                            />
                            <View
                              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-red dark:bg-accent-red-dark border-2 border-white dark:border-[#1a1a1a]"
                              pointerEvents="none"
                            />
                          </View>
                        </TouchableOpacity>
                      </AttentionShake>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleChatAgency(agency.name)}
                        className="w-9 h-9 rounded-full bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)] items-center justify-center"
                        accessibilityLabel={`Chat with ${agency.name}`}
                      >
                        <SolarChatRoundDotsBoldIcon
                          width={18}
                          height={18}
                          color={theme.textMuted}
                        />
                      </TouchableOpacity>
                    )
                  ) : null}
                </View>
              </AppAnimatedView>
            ))}
          </View>
        </AppAnimatedView>

        {/* Evidence log */}
        <AppAnimatedView
          entering={brandFadeIn.delay(180)}
          className="mb-4 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.1)]"
        >
          <AppText className="text-sm font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark mb-3">
            Evidence log
          </AppText>
          <View className="flex-row flex-wrap gap-2">
            {evidenceItems.length > 0
              ? evidenceItems.map((item, index) =>
                  item.type === 'image' || item.type === 'video' ? (
                    item.uri ? (
                      <AppAnimatedView
                        key={item.id}
                        entering={brandFadeInUp.delay(200 + index * 35)}
                      >
                        <EvidenceThumbnail
                          item={item}
                          size={thumbnailSize}
                          onRemove={() => removeMedia(item.id)}
                        />
                      </AppAnimatedView>
                    ) : null
                  ) : (
                    <AppAnimatedView
                      key={item.id}
                      entering={brandFadeInUp.delay(200 + index * 35)}
                      style={{ width: '100%' }}
                    >
                      <EvidenceNoteCard
                        item={item}
                        onRemove={() => removeMedia(item.id)}
                      />
                    </AppAnimatedView>
                  )
                )
              : null}
            {/* Placeholder slots so user sees where evidence will appear */}
            {[0, 1, 2].map((i) => (
              <EvidencePlaceholder
                key={`placeholder-${i}`}
                size={thumbnailSize}
              />
            ))}
          </View>
        </AppAnimatedView>

        {/* Status line */}
        <AppAnimatedView entering={brandFadeIn.delay(220)} className="px-1">
          <AppText
            variant="caption"
            className="text-captionDark dark:text-captionDark-dark text-center"
          >
            Sharing live location with {contacts.length} contact
            {contacts.length !== 1 ? 's' : ''}. Dispatched at{' '}
            {formatActiveSince(activeSince)}.
          </AppText>
        </AppAnimatedView>
      </AppAnimatedScrollView>
    </AppAnimatedSafeAreaView>
  );
}
