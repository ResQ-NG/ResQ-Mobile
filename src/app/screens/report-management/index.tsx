import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { useAppColorScheme } from '@/theme/colorMode';
import { NewReportMediaStep } from './components';
import { removeMedia } from '@/lib/utils/captured-media';
import { useCapturedMediaStore } from '@/stores/captured-media-store';
import { useReportDraftStore } from '@/stores/report-draft-store';

export default function NewReportScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const setMediaUris = useReportDraftStore((s) => s.setMediaUris);
  const draftMediaSlots = useReportDraftStore((s) => s.mediaSlots);
  const capturedMedia = useCapturedMediaStore((s) => s.items);

  const mediaSlots =
    capturedMedia.length > 0
      ? capturedMedia.map((item) => ({ id: item.id, uri: item.uri }))
      : draftMediaSlots;

  const handleBack = usePreventDoublePress(() => router.back());
  const handleNext = usePreventDoublePress(() => {
    const source = capturedMedia.length > 0 ? capturedMedia : mediaSlots;
    const uris = source.map((s) => s.uri).filter((u): u is string => u != null);
    setMediaUris(uris);
    router.push('/screens/report-management/details');
  });

  const handleRemoveMedia = (
    slot: { id: string; uri: string | null },
    index: number
  ) => {
    if (capturedMedia.length > 0) {
      // When using captured media store, remove by id.
      removeMedia(slot.id);
      return;
    }
    // Fallback to draft store slots.
    if (slot.uri) {
      useReportDraftStore.getState().setMediaSlotUri(index, null);
    }
  };

  const handlePreviewImage = usePreventDoublePress((uri: string, index: number) => {
    router.push({
      pathname: '/(modals)/image-preview',
      params: { uri, mode: 'media', index: String(index) },
    } as Parameters<typeof router.push>[0]);
  });

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="sm"
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
            accessibilityLabel="Go back"
          />
          <AppHeading
            level={4}
            className="text-primaryDark dark:text-primaryDark-dark"
          >
            New report
          </AppHeading>
          <View style={{ width: 44, height: 44 }} />
        </AppAnimatedView>
      }
    >
      <NewReportMediaStep
        mediaSlots={mediaSlots}
        onSlotPress={() => {}}
        onPreviewImage={handlePreviewImage}
        onRemoveMedia={handleRemoveMedia}
        onNextPress={handleNext}
        bottomInset={insets.bottom}
      />
    </AppAnimatedSafeAreaView>
  );
}
