import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { RoundedButton } from '@/components/ui/RoundedButton';
import SolarArrowLeftBrokenIcon from '@/components/icons/solar/arrow-left-broken';
import { useAppColorScheme } from '@/theme/colorMode';
import { useActiveWatches } from '@/hooks/useActiveWatches';
import { WatchMeProfileCard } from '@/components/watchme/WatchMeProfileCard';
import { ContactLocationMapView } from '@/components/maps/ContactLocationMapView';
import { AppText } from '@/components/ui/AppText';

export default function WatchMeStatusModalScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const watchId = typeof params.id === 'string' ? params.id : null;
  const watches = useActiveWatches();
  const watch = watchId ? watches.find((w) => w.id === watchId) : null;

  const handleCancel = () => router.back();

  if (!watchId || !watch) {
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
              onPress={handleCancel}
              icon={
                <SolarArrowLeftBrokenIcon
                  width={20}
                  height={20}
                  color={theme.textMuted}
                />
              }
              className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
              accessibilityLabel="Cancel"
            />
          </AppAnimatedView>
        }
      >
        <View className="flex-1 items-center justify-center px-6">
          <AppText className="text-center text-captionDark dark:text-captionDark-dark">
            Contact not found.
          </AppText>
        </View>
      </AppAnimatedSafeAreaView>
    );
  }

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
            onPress={handleCancel}
            icon={
              <SolarArrowLeftBrokenIcon
                width={20}
                height={20}
                color={theme.textMuted}
              />
            }
            className="bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]"
            accessibilityLabel="Cancel"
          />
        </AppAnimatedView>
      }
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 8,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {watch.coordinates ? (
          <AppAnimatedView
            entering={brandFadeIn.delay(60)}
            className="overflow-hidden rounded-2xl mb-4"
          >
            <ContactLocationMapView
              coordinate={watch.coordinates}
              name={watch.name}
              avatarBgIndex={watch.avatarBgIndex}
              height={220}
            />
          </AppAnimatedView>
        ) : null}
        <AppAnimatedView
          entering={brandFadeIn.delay(80)}
          className="bg-[rgba(255,255,255,0.96)] dark:bg-[rgba(18,18,18,0.95)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.16)] rounded-3xl px-6 py-6"
        >
          <WatchMeProfileCard watch={watch} />
        </AppAnimatedView>
        {/* Reserved for future SOS / expanded status section */}
      </ScrollView>
    </AppAnimatedSafeAreaView>
  );
}
